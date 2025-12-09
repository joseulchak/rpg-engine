import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  roles: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
