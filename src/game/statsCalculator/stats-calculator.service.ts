import { Injectable } from '@nestjs/common';
import {
  BaseAttributesDto,
  DerivedStatsDto,
} from '../dtos/character-stats.dto';
import { GRAVITY } from '../../config/constants';

@Injectable()
export class StatsCalculatorService {
  calculate(stats: BaseAttributesDto): DerivedStatsDto {
    const HP_PER_VIT: number = 10;
    const HP_PER_CON: number = 2;
    const MP_PER_ENE: number = 10;
    const MP_PER_ARC: number = 5;
    const derivedStats: DerivedStatsDto = {
      maxHp: calculateMaxHp(),
      maxMp: calculateMaxMp(),
      carryCapacity: calculateCarryCapacity(),
    };

    return derivedStats;

    function calculateMaxHp(): number {
      return stats.vitality * HP_PER_VIT + stats.constitution * HP_PER_CON;
    }

    function calculateMaxMp(): number {
      return stats.energy * MP_PER_ENE + stats.arcane * MP_PER_ARC;
    }

    function calculateCarryCapacity(): number {
      return (stats.strength * stats.characterWeight) / GRAVITY;
    }
  }
}
