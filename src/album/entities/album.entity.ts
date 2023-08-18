import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  RelationId,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @ManyToOne(() => Artist, (artist) => artist.albums)
  artist: Artist | null;

  @OneToMany(() => Track, (tracks) => tracks.artist)
  tracks: Track[];

  @Column({ nullable: true })
  @RelationId((album: Album) => album.artist)
  artistId: string | null;
}
