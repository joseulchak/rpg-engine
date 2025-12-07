import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCharacterCommand } from '../commands/create-character.command';
import { DataSource } from 'typeorm';
import { StatsCalculatorService } from '../statsCalculator/stats-calculator.service';
import { DerivedStatsDto } from '../dtos/character-stats.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { GameEvent } from 'src/entities/GameEvent.entity';
import { Character } from 'src/entities/Character.entity';

@CommandHandler(CreateCharacterCommand)
export class CreateCharacterHandler implements ICommandHandler<CreateCharacterCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly statsCalculator: StatsCalculatorService,
  ) {}

  async execute(command: CreateCharacterCommand): Promise<void> {
    const { characterId, baseInfo, attributes } = command;

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
        baseInfo,
        attributes,
        derivatedStats,
      };
      event.version = 1;

      const character = new Character();
      character.id = characterId;
      character.name = baseInfo.name;
      character.race = baseInfo.race;
      character.class = baseInfo.class;
      character.height = baseInfo.height;
      character.weight = baseInfo.weight;
      character.age = baseInfo.age;
      character.strength = attributes.strength;
      character.dexterity = attributes.dexterity;
      character.agility = attributes.agility;
      character.arcane = attributes.arcane;
      character.vitality = attributes.vitality;
      character.energy = attributes.energy;
      character.constitution = attributes.constitution;
      character.maxHp = derivatedStats.maxHp;
      character.maxMp = derivatedStats.maxMp;
      character.maxStamina = derivatedStats.maxStamina;

      await queryRunner.manager.save(character);
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
