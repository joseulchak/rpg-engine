import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email'])
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
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
