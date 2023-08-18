import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Artist, (artist) => artist.albums)
  artist: Artist | null;

  @ManyToOne(() => Album, (album) => album.tracks)
  album: Album | null;

  @Column({ nullable: true })
  @RelationId((track: Track) => track.artist)
  artistId: string | null;

  @Column({ nullable: true })
  @RelationId((track: Track) => track.album)
  albumId: string | null;

  @Column()
  duration: number;
}
