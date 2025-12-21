export class CharacterBaseInfoDto {
  name: string;
  race: string;
  class: string;
  height: number;
  weight: number;
  age: number;
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
  carryCapacity: number;

  currentHp: number;
  currentMp: number;
  currentStamina: number;

  physicalAttack: number;
  physicalDefense: number;
  arcaneAttack: number;
  arcaneDefense: number;

  conjurePoints: number;
  actionsPerRound: number;
  movementSpeed: number;
  // horizontalJumpDistance: number;
  // verticalJumpDistance: number;
}
