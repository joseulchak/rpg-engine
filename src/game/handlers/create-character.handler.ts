import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCharacterCommand } from '../commands/create-character.command';
import { DataSource } from 'typeorm';
import { StatsCalculatorService } from '../statsCalculator/stats-calculator.service';
import {
  CharacterBaseInfoDto, // New DTOs
  BaseAttributesDto,
  DerivedStatsDto,
} from '../dtos/character-stats.dto';
import { ConflictException } from '@nestjs/common';
import { GameEvent } from 'src/entities/GameEvent.entity';
import { Character } from 'src/entities/Character.entity';
import { DatabaseService } from 'src/database/database.service';

@CommandHandler(CreateCharacterCommand)
export class CreateCharacterHandler implements ICommandHandler<CreateCharacterCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly statsCalculator: StatsCalculatorService,
    private readonly databaseService: DatabaseService,
  ) {}

  async execute(command: CreateCharacterCommand): Promise<void> {
    const { characterId, baseInfo, attributes, user } = command; // Destructure new fields

    const derivedStats: DerivedStatsDto = this.statsCalculator.calculate(
      baseInfo,
      attributes,
    );

    try {
      const event = new GameEvent();
      event.aggregateId = characterId;
      event.type = 'CharacterCreated';
      event.payload = {
        baseInfo, // Store separated DTOs in event payload
        attributes,
        derivedStats,
      };
      event.version = 1;

      let character = new Character();
      character = {
        ...baseInfo,
        ...attributes,
        ...derivedStats,
        id: characterId,
        userId: user.id,
        level: 1,
        currXp: 0,
      };

      await this.databaseService.executeSaveTransaction(character);
      await this.databaseService.executeSaveTransaction(event);
    } catch (error) {
      console.log(error);
      throw new ConflictException('Failed to create character');
    }
  }
}
