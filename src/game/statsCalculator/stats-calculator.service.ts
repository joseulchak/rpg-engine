import { Injectable } from '@nestjs/common';
import {
  BaseAttributesDto,
  DerivedStatsDto,
} from '../dtos/character-stats.dto';
import { GRAVITY } from '../../config/constants';

@Injectable()
export class StatsCalculatorService {
  private readonly HP_PER_VIT: number = 10;
  private readonly HP_PER_CON: number = 2;
  private readonly MP_PER_ENE: number = 10;
  private readonly MP_PER_ARC: number = 5;
  private readonly STAMINA_PER_CON: number = 2;
  calculate(stats: BaseAttributesDto): DerivedStatsDto {
    const derivedStats: DerivedStatsDto = {
      maxHp: this.calculateMaxHp(stats),
      maxMp: this.calculateMaxMp(stats),
      maxStamina: this.calculateMaxStamina(stats),
    };

    return derivedStats;
  }
  private calculateMaxHp(stats: BaseAttributesDto): number {
    return (
      stats.vitality * this.HP_PER_VIT + stats.constitution * this.HP_PER_CON
    );
  }

  private calculateMaxMp(stats: BaseAttributesDto): number {
    return stats.energy * this.MP_PER_ENE + stats.arcane * this.MP_PER_ARC;
  }

  private calculateMaxStamina(stats: BaseAttributesDto): number {
    return stats.constitution * this.STAMINA_PER_CON;
  }
}
