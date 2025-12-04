import { Module } from '@nestjs/common';
import { StatsCalculatorService } from './statsCalculator/stats-calculator.service';
import { GameController } from './game.controller';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [StatsCalculatorService],
})
export class GameModule {}
