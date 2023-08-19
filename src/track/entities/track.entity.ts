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

  @ManyToOne(() => Artist, (artist) => artist.albums, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  artist: Artist | null;

  @ManyToOne(() => Album, (album) => album.tracks, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  album: Album | null;

  @Column({ nullable: true })
  @RelationId((track: Track) => track.artist)
  artistId: string | null;

  @Column({ nullable: true })
  @RelationId((track: Track) => track.album)
  albumId: string | null;

  @Column()
  duration: number;

  static create(
    id: string,
    name: string,
    duration: number,
    artistId: string,
    albumId: string,
  ): Track {
    const track = new Track();
    track.id = id;
    track.name = name;
    track.duration = duration;
    track.artistId = artistId;
    track.albumId = albumId;
    return track;
  }
}
