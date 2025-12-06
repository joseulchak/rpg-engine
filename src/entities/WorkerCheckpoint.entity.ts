import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class WorkerCheckpoint {
  @PrimaryColumn()
  workerName: string; // e.g., 'level-up-worker'

  @Column({ default: 0 })
  lastSequenceNumber: number;
}
