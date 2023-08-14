import { Exclude, Transform } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

function BigIntToNumber(): PropertyDecorator {
  return Transform(value => { const res: number = Number(value); return res; });
}

class ColumnNumberTransformer {
  public to(data: number): bigint {
      return BigInt(data);
  }

  public from(data: bigint): number {
      const res: number = Number(data);
      return res;
  }
}

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

  @Column({type: 'bigint', transformer: new ColumnNumberTransformer()})
  createdAt: number;

  @Column({type: 'bigint', transformer: new ColumnNumberTransformer() })
  updatedAt: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
