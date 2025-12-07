export class CharacterBaseDto {
  name: string;
  race: string;
  class: string;
  height: number;
  weight: number;
  age: number;
  level?: number | null;
  currXp?: number | null;
}

export class BaseAttributesDto {
  strength: number;
  dexterity: number;
  agility: number;
  arcane: number;
  vitality: number;
  energy: number;
  constitution: number;
}

export class DerivedStatsDto {
  maxHp: number;
  maxMp: number;
  maxStamina: number;
}
