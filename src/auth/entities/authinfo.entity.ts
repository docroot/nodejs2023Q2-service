import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class AuthInfo {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  //   @Column({ type: 'bigint', transformer: new BigintTransformer() })
  //   atCreatedAt: number;

  //   @Column({ type: 'bigint', transformer: new BigintTransformer() })
  //   rtCreatedAt: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: User;
}
