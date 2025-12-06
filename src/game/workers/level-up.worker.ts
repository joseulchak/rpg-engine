import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { GAME_QUEUE } from 'src/config/constants';
import { LevelUpCommand } from '../commands/level-up.command';

@Processor(GAME_QUEUE)
export class LevelUpWorker extends WorkerHost {
  private readonly logger = new Logger(LevelUpWorker.name);

  async process(job: Job<LevelUpCommand>): Promise<void> {
    const { characterId } = job.data;
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // TODO: Level up logic (gameEvent, character record update)
    this.logger.log(`[Job ${job.id}] COMPLETE: ${characterId} is now Level 2!`);
  }
}
