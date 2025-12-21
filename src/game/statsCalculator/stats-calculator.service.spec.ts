import { Test, TestingModule } from '@nestjs/testing';
import { StatsCalculatorService } from './stats-calculator.service';
import {
  BaseAttributesDto,
  CharacterBaseInfoDto,
} from '../dtos/character-stats.dto';

describe('StatsCalculatorService', () => {
  let service: StatsCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsCalculatorService],
    }).compile();

    service = module.get<StatsCalculatorService>(StatsCalculatorService);
  });

  const baseInfo: CharacterBaseInfoDto = {
    race: 'Human',
    name: 'John Doe',
    class: 'Warrior',
    height: 180,
    weight: 70,
    age: 25,
  };
  const attributes: BaseAttributesDto = {
    strength: 15,
    dexterity: 15,
    agility: 15,
    arcane: 15,
    vitality: 15,
    energy: 15,
    constitution: 15,
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // maxHp: this.calculateMaxHp(stats),
  //     maxMp: this.calculateMaxMp(stats),
  //     maxStamina: this.calculateMaxStamina(stats),
  //     carryCapacity: this.calculateCarryCapacity(stats),
  //     currentHp: 0,
  //     currentMp: 0,
  //     currentStamina: 0,
  //     physicalAttack: 0,
  //     physicalDefense: 0,
  //     arcaneAttack: 0,
  //     arcaneDefense: 0,
  //     conjurePoints: 0,
  //     horizontalJumpDistance: 0,
  //     verticalJumpDistance: 0,
  //     movementSpeed: 0,
  //     actionsPerRound: 0,

  it('should calculate Max  HP (Vitality * 10 + Constitution * 2)', () => {
    const result = service.calculate(baseInfo, attributes);
    expect(result.maxHp).toBe(180);
  });

  it('should calculate Max MP (energy * 10 + Arcane *5)', () => {
    const result = service.calculate(baseInfo, attributes);
    expect(result.maxMp).toBe(225);
  });

  it('should calculate Max Stamina (constitution * 2)', () => {
    const result = service.calculate(baseInfo, attributes);
    expect(result.maxStamina).toBe(30);
  });

  it('should calculat carry capacity (strengh * weight) / gravity', () => {
    const result = service.calculate(baseInfo, attributes);
    expect(result.carryCapacity).toBeCloseTo(150);
  });

  it('should calculate physical attack (strengh + dexterity)', () => {
    const result = service.calculate(baseInfo, attributes);
    expect(result.physicalAttack).toBe(30);
  });

  it('should calculate physical defense (agility + constitution)', () => {
    const result = service.calculate(baseInfo, attributes);
    expect(result.physicalDefense).toBe(30);
  });

  it('should calculate arcane attack (dexterity + arcane)', () => {
    const result = service.calculate(baseInfo, attributes);
    expect(result.arcaneAttack).toBe(30);
  });

  it('should calculate arcane defense (arcane + energy)', () => {
    const result = service.calculate(baseInfo, attributes);
    expect(result.arcaneDefense).toBe(30);
  });

  it('should calculate conjure points (arcane + energy) / (strengh + dexterity + agility + vitality + constitution) * (arcane / 10)', () => {
    const result = service.calculate(baseInfo, attributes);
    expect(result.conjurePoints).toBeCloseTo(4);
  });

  it('should calculate actions per round', () => {
    const result = service.calculate(baseInfo, attributes);
    expect(result.actionsPerRound).toBe(1);
  });

  it('should calculate movement speed', () => {
    const result = service.calculate(baseInfo, attributes);
    expect(result.movementSpeed).toBeCloseTo(2.65);
  });
});
