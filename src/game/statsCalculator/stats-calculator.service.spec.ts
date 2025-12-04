import { Test, TestingModule } from '@nestjs/testing';
import { StatsCalculatorService } from './stats-calculator.service';
import { BaseAttributesDto } from '../dtos/character-stats.dto';

describe('StatsCalculatorService', () => {
  let service: StatsCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsCalculatorService],
    }).compile();

    service = module.get<StatsCalculatorService>(StatsCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate Max  HP (Vitality * 10 + Constitution * 2)', () => {
    const stats: BaseAttributesDto = {
      strength: 10,
      dexterity: 10,
      agility: 10,
      vitality: 5,
      constitution: 10,
      energy: 10,
      arcane: 10,
      characterWeight: 70,
    };
    // 5 * 10 + 10 * 2 = 70
    const result = service.calculate(stats);
    expect(result.maxHp).toBe(70);
  });

  it('should calculate Max HP (energy * 10 + Arcane *5)', () => {
    const stats: BaseAttributesDto = {
      strength: 10,
      dexterity: 10,
      agility: 10,
      vitality: 10,
      constitution: 10,
      energy: 5,
      arcane: 4,
      characterWeight: 70,
    };
    // 5 * 10 + 4 * 5 = 70
    const result = service.calculate(stats);
    expect(result.maxMp).toBe(70);
  });

  it('should calculate Carry Capacity (Strength * characterWeight / Gravity)', () => {
    const stats: BaseAttributesDto = {
      strength: 15,
      dexterity: 10,
      agility: 10,
      vitality: 10,
      constitution: 10,
      energy: 10,
      arcane: 10,
      characterWeight: 70,
    };
    //15 * 70 / 9.81 = 107.03
    const result = service.calculate(stats);
    expect(result.carryCapacity).toBeCloseTo(107.03, 2);
  });
});
