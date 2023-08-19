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

  static create(
    id: string,
    name: string,
    year: number,
    artistId: string,
  ): Album {
    const album = new Album();
    album.id = id;
    album.name = name;
    album.year = year;
    album.artistId = artistId;
    return album;
  }
}
