import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { GAME_QUEUE, LEVEL_UP_COMMAND } from 'src/config/constants';
import { GainXpCommand } from '../commands/gain-xp.command';
import { Job, Queue } from 'bullmq';
import { LevelUpCommand } from '../commands/level-up.command';

@Processor(GAME_QUEUE)
export class GainXpWorker extends WorkerHost {
  constructor(@InjectQueue(GAME_QUEUE) private readonly gameQueue: Queue) {
    super();
  }
  private readonly logger = new Logger(GainXpWorker.name);

  async process(job: Job<GainXpCommand>): Promise<void> {
    const { characterId, amount } = job.data;
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // TODO: Gain XP logic (gameEvent)
    this.logger.log(
      `[Job ${job.id}] COMPLETE: ${characterId} gained ${amount} XP!`,
    );

    if (amount > 100) {
      const command = new LevelUpCommand(characterId);
      await this.gameQueue.add(LEVEL_UP_COMMAND, command);
      this.logger.log(`[ADDED LEVEL-UP JOB]`);
    }
  }
}
