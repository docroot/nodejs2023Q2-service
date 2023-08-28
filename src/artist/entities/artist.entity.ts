import { Album } from 'src/album/entities/album.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];

  static create(id: string, name: string, grammy: boolean): Artist {
    const artist = new Artist();
    artist.id = id;
    artist.name = name;
    artist.grammy = grammy;
    return artist;
  }
}
