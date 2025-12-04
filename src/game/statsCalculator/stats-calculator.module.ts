import { Module } from '@nestjs/common';
import { StatsCalculatorService } from './stats-calculator.service';

@Module({
  imports: [],
  controllers: [],
  providers: [StatsCalculatorService],
})
export class StatsCalculatorModule {}
