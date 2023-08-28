import { Exclude } from 'class-transformer';
import { BigintTransformer } from 'src/utils/bigint.transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // Table name will be "users" by default. If you want to change it use @Table({name: ...})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  version: number;

  @Column({ type: 'bigint', transformer: new BigintTransformer() })
  createdAt: number;

  @Column({ type: 'bigint', transformer: new BigintTransformer() })
  updatedAt: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
