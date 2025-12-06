import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class GameEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  aggregateId: string;

  @Index({ unique: true })
  @Column({ generated: 'increment' })
  sequenceNumber: number;

  @Column()
  type: string; //DamageTaken, ItemEquipped, ItemUnequipped, etc...

  @Column('jsonb')
  payload: Record<string, any>; // { amount: 10, source: 'Trap' }

  @Column()
  version: number; // To handle concurrency/ordering later

  @CreateDateColumn()
  createdAt: Date;
}
