import { Album } from 'src/album/entities/album.entity';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class FavAlbum {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @OneToOne(() => Album)
  @JoinColumn({ name: 'id' })
  album: Album;
}
