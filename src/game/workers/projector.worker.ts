import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Character } from '../../entities/Character.entity';
import { GameEvent } from '../../entities/GameEvent.entity';
import { GAME_QUEUE } from '../../config/constants';

@Processor(GAME_QUEUE)
export class ProjectorWorker extends WorkerHost {
  private readonly logger = new Logger(ProjectorWorker.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super();
  }

  async process(job: Job<any>): Promise<void> {
    // We only care about the 'sync-view' job type here.
    // (In a real Kafka system, we would subscribe to topics.
    // In BullMQ, we filter by job name or handle specific jobs).
    if (job.name === 'sync-view') {
      const { characterId } = job.data;
      await this.project(characterId);
    }
  }

  private async project(aggregateId: string) {
    // 1. Load the CURRENT View State (The Bookmark)
    let charView: Character | null = await this.dataSource.manager.findOne(
      Character,
      {
        where: { id: aggregateId },
      },
    );

    // If no view exists, we start from 0.
    const lastSeq = charView ? charView.lastSequenceNumber : 0;

    // 2. Load ONLY New Events (The Optimization)
    // WHERE sequenceNumber > lastSeq
    const events = await this.dataSource.manager
      .createQueryBuilder(GameEvent, 'event')
      .where('event.aggregateId = :id', { id: aggregateId })
      .andWhere('event.sequenceNumber > :seq', { seq: lastSeq })
      .orderBy('event.sequenceNumber', 'ASC')
      .getMany();

    if (events.length === 0) return; // Nothing new to do

    // 3. Initialize View if null (First time)
    if (!charView) {
      charView = new Character();
      charView.id = aggregateId;
      // defaults...
    }

    // 4. Apply ONLY the Delta (The changes)
    for (const event of events) {
      console.log('EVENT', event);
      if (event.type === 'CharacterCreated') {
        // ... map static fields ...
      }
      if (event.type === 'XPGained') {
        charView.currXp = (charView.currXp || 0) + event.payload.amount;
      }
      if (event.type === 'LevelUp') {
        charView.level = event.payload.newLevel;
      }

      // UPDATE THE BOOKMARK
      charView.lastSequenceNumber = event.sequenceNumber;
    }

    // 5. Save State + New Bookmark
    await this.dataSource.manager.save(Character, charView);

    this.logger.log(
      `Projected ${events.length} new events. Head at ${charView.lastSequenceNumber}`,
    );
  }
}
