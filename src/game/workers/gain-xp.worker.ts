import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { GAME_QUEUE, LEVEL_UP_COMMAND } from 'src/config/constants';
import { GainXpCommand } from '../commands/gain-xp.command';
import { Job, Queue } from 'bullmq';
import { CharacterAggregate } from '../aggregates/character.aggregate';
import { GameEvent } from 'src/entities/GameEvent.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Processor(GAME_QUEUE)
export class GainXpWorker extends WorkerHost {
  private readonly logger = new Logger(GainXpWorker.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectQueue(GAME_QUEUE) private readonly gameQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<GainXpCommand>): Promise<void> {
    if (job.name !== 'gain-xp') {
      return;
    }
    const { characterId, amount } = job.data;

    // 1. Start Transaction (CRITICAL)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. Load History
      // Lock the rows to prevent race conditions if you want to be extra safe
      const events = await queryRunner.manager.find(GameEvent, {
        where: { aggregateId: characterId },
        order: { sequenceNumber: 'ASC' },
      });

      // 3. Replay State
      const aggregate = new CharacterAggregate(characterId, events);

      // 4. Execute Logic (Returns Array of Events)
      const newEvents = aggregate.gainXp(amount);

      // 5. Save All Events Atomically
      for (const event of newEvents) {
        await queryRunner.manager.save(event);
        this.logger.log(`[Job ${job.id}] Event Saved: ${event.type}`);
      }

      // 6. Commit
      await queryRunner.commitTransaction();

      // TRIGGER THE PROJECTOR
      // We add a job to the SAME queue (or a different one) to update the view asynchronously
      await this.gameQueue.add('sync-character-view', { characterId });
    } catch (e) {
      await queryRunner.rollbackTransaction();
      this.logger.error(e);
      throw e; // Retry job
    } finally {
      await queryRunner.release();
    }
  }
}
