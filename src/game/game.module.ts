import { Module } from '@nestjs/common';
import { StatsCalculatorService } from './statsCalculator/stats-calculator.service';
import { GameController } from './game.controller';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { CreateCharacterHandler } from './handlers/create-character.handler';
import { GameEvent } from 'src/entities/GameEvent.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([GameEvent])],
  controllers: [GameController],
  providers: [StatsCalculatorService, CreateCharacterHandler],
})
export class GameModule {}
