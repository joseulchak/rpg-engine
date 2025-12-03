import { GameEvent } from 'src/entities/GameEvent.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([GameEvent])],
})
export class EventsModule {}
