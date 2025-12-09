import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('characters')
export class Character {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  race: string;

  @Column({ nullable: true })
  class: string;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'int', nullable: true })
  age: number;

  // --- PROGRESSION ---
  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  currXp: number; // The cached sum of XPGained events

  // --- ATTRIBUTES (Base) ---
  @Column({ default: 0 })
  strength: number;

  @Column({ default: 0 })
  dexterity: number;

  @Column({ default: 0 })
  agility: number;

  @Column({ default: 0 })
  vitality: number;

  @Column({ default: 0 })
  constitution: number;

  @Column({ default: 0 })
  energy: number;

  @Column({ default: 0 })
  arcane: number;

  // --- DERIVED STATS (Calculated) ---
  @Column({ default: 0 })
  maxHp: number;

  @Column({ default: 0 })
  maxMp: number;

  @Column({ default: 0 })
  maxStamina: number; // "ST" from your sheet

  @Column({ default: 0 })
  lastSequenceNumber: number; // The bookmark
}
