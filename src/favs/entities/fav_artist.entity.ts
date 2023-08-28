import { Artist } from 'src/artist/entities/artist.entity';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class FavArtist {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @OneToOne(() => Artist)
  @JoinColumn({ name: 'id' })
  artist: Artist;
}
