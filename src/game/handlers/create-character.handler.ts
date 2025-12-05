import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCharacterCommand } from '../commands/create-character.command';
import { DataSource } from 'typeorm';
import { StatsCalculatorService } from '../statsCalculator/stats-calculator.service';
import { DerivedStatsDto } from '../dtos/character-stats.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { GameEvent } from 'src/entities/GameEvent.entity';

@CommandHandler(CreateCharacterCommand)
export class CreateCharacterHandler implements ICommandHandler<CreateCharacterCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly statsCalculator: StatsCalculatorService,
  ) {}

  async execute(command: CreateCharacterCommand): Promise<void> {
    const { characterId, name, attributes } = command;

    const derivatedStats: DerivedStatsDto =
      this.statsCalculator.calculate(attributes);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const event = new GameEvent();
      event.aggregateId = characterId;
      event.type = 'CharacterCreated';
      event.payload = {
        name,
        attributes,
        derivatedStats,
      };
      event.version = 1;
      await queryRunner.manager.save(event);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException('Failed to create character');
    } finally {
      await queryRunner.release();
    }
  }
}
