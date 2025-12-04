export class BaseAttributesDto {
  strength: number;
  dexterity: number;
  agility: number;
  arcane: number;
  vitality: number;
  energy: number;
  constitution: number;

  characterWeight: number;
}

export class DerivedStatsDto {
  maxHp: number;
  maxMp: number;
  carryCapacity: number;
}
