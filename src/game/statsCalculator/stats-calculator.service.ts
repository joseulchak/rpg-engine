import { Injectable } from '@nestjs/common';
import {
  BaseAttributesDto,
  DerivedStatsDto,
  CharacterBaseInfoDto,
} from '../dtos/character-stats.dto';
import { GRAVITY } from '../../config/constants';

@Injectable()
export class StatsCalculatorService {
  calculate(
    baseInfo: CharacterBaseInfoDto,
    attributes: BaseAttributesDto,
  ): DerivedStatsDto {
    const stats = { ...baseInfo, ...attributes }; // Merge for calculation simplicity

    const derivedStats: DerivedStatsDto = {
      maxHp: this.calculateMaxHp(stats),
      maxMp: this.calculateMaxMp(stats),
      maxStamina: this.calculateMaxStamina(stats),
      carryCapacity: this.calculateCarryCapacity(stats),
      //to be calculated
      currentHp: 0,
      currentMp: 0,
      currentStamina: 0,
      physicalAttack: this.calculatePhysicalAttack(stats),
      physicalDefense: this.calculatePhysicalDefense(stats),
      arcaneAttack: this.calculateArcaneAttack(stats),
      arcaneDefense: this.calculateArcaneDefense(stats),
      conjurePoints: this.calculateConjurePoints(stats),
      actionsPerRound: this.calculateActionsPerRound(stats),
      movementSpeed: this.calculateMovimentSpeed(stats),
      // horizontalJumpDistance: 0,
      // verticalJumpDistance: 0,
    };

    return derivedStats;
  }
  private calculateMaxHp(stats: any): number {
    const HP_PER_VIT: number = 10;
    const HP_PER_CON: number = 2;
    return stats.vitality * HP_PER_VIT + stats.constitution * HP_PER_CON;
  }

  private calculateMaxMp(stats: any): number {
    const MP_PER_ENE: number = 10;
    const MP_PER_ARC: number = 5;
    return stats.energy * MP_PER_ENE + stats.arcane * MP_PER_ARC;
  }

  private calculateMaxStamina(stats: any): number {
    const STAMINA_PER_CON: number = 2;
    return stats.constitution * STAMINA_PER_CON;
  }

  private calculateCarryCapacity(stats: any): number {
    const CAPACITY_CONSTANT = 10;
    return stats.strength * CAPACITY_CONSTANT;
  }

  private calculatePhysicalAttack(stats: any): number {
    return stats.strength + stats.dexterity;
  }

  private calculatePhysicalDefense(stats: any): number {
    return stats.agility + stats.constitution;
  }

  private calculateArcaneAttack(stats: any): number {
    return stats.dexterity + stats.arcane;
  }

  private calculateArcaneDefense(stats: any): number {
    return stats.arcane + stats.energy;
  }

  private calculateConjurePoints(stats: any): number {
    const ARCANE_WEIGHT = 2; // Arcane is the primary resource stat
    const ENERGY_WEIGHT = 1; // Energy provides a secondary pool boost
    const CP_TUNING_DIVISOR = 10; // User-requested divisor for overall scaling

    const weightedMagicScore =
      stats.arcane * ARCANE_WEIGHT + stats.energy * ENERGY_WEIGHT;

    // Use Math.floor to ensure a whole number of points, avoiding fractional CP
    return Math.floor(weightedMagicScore / CP_TUNING_DIVISOR);
  }

  private calculateActionsPerRound(stats: any): number {
    const AGILITY_WEIGHT = 0.6; // Primary influence (Quickness)
    const DEXTERITY_WEIGHT = 0.3; // Secondary influence (Coordination/Fluidity)
    const ENERGY_WEIGHT = 0.1; // Tertiary influence (Stamina/Focus)
    const APR_TUNING_CONSTANT = 20; // Points required for +1 APR (from 1 to 5)
    const MAX_APR = 5;

    // Calculate a weighted score based on multiple, relevant attributes
    const weightedAPRScore =
      stats.agility * AGILITY_WEIGHT +
      stats.dexterity * DEXTERITY_WEIGHT +
      stats.energy * ENERGY_WEIGHT;

    // APR is 1 (base) + tiers of bonus actions
    const bonusActions = Math.floor(weightedAPRScore / APR_TUNING_CONSTANT);

    const totalAPR = 1 + bonusActions;

    // Enforce hard cap
    return Math.min(totalAPR, MAX_APR);
  }

  private calculateMovimentSpeed(stats: any): number {
    const BASE_SPEED = 1.0; // Minimum speed (m/s)
    const AGI_FACTOR = 0.04;
    const DEX_FACTOR = 0.01; // Lower weighting than AGI, as requested
    const HEIGHT_FACTOR = 0.005; // Minor scaling based on stride length

    // Speed scales linearly with Agility, Dexterity, and Height
    return (
      BASE_SPEED +
      stats.agility * AGI_FACTOR +
      stats.dexterity * DEX_FACTOR +
      stats.height * HEIGHT_FACTOR
    );
  }
}
