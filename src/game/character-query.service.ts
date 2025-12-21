import { Injectable, NotFoundException } from '@nestjs/common';
import { Character } from 'src/entities/Character.entity';
import { Repository } from 'typeorm';
import { CharacterViewDto } from './dtos/character-view.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CharacterBaseInfoDto,
  BaseAttributesDto,
  DerivedStatsDto,
} from './dtos/character-stats.dto'; // New imports

@Injectable()
export class CharacterQueryService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async getCharacterById(
    characterId: string,
    userId: string,
  ): Promise<CharacterViewDto> {
    const character = await this.characterRepository.findOne({
      where: { id: characterId, userId },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    // Explicit mapping to CharacterViewDto (Nested Structure)
    return {
      id: character.id,
      level: character.level,
      currXp: character.currXp,
      baseInfo: {
        name: character.name,
        race: character.race,
        class: character.class,
        height: character.height,
        weight: character.weight,
        age: character.age,
      } as CharacterBaseInfoDto,
      attributes: {
        strength: character.strength,
        dexterity: character.dexterity,
        agility: character.agility,
        arcane: character.arcane,
        vitality: character.vitality,
        energy: character.energy,
        constitution: character.constitution,
      } as BaseAttributesDto,
      stats: {
        maxHp: character.maxHp,
        maxMp: character.maxMp,
        maxStamina: character.maxStamina,
        carryCapacity: character.carryCapacity,
      } as DerivedStatsDto,
    };
  }
}
