import { Module } from '@nestjs/common';
import { StatsCalculatorService } from './statsCalculator/stats-calculator.service';
import { GameController } from './game.controller';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { CreateCharacterHandler } from './handlers/create-character.handler';
import { GameEvent } from 'src/entities/GameEvent.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerCheckpoint } from 'src/entities/WorkerCheckpoint.entity';
import { BullModule } from '@nestjs/bullmq';
import { GAME_QUEUE } from 'src/config/constants';
import { GainXpWorker } from './workers/gain-xp.worker';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([GameEvent, WorkerCheckpoint]),
    BullModule.registerQueue({
      name: GAME_QUEUE,
    }),
  ],
  controllers: [GameController],
  providers: [StatsCalculatorService, CreateCharacterHandler, GainXpWorker],
  exports: [BullModule],
})
export class GameModule {}
