import { Track } from 'src/track/entities/track.entity';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class FavTrack {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @OneToOne(() => Track)
  @JoinColumn({ name: 'id' })
  track: Track;
}
