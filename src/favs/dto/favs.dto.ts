import { ApiProperty } from '@nestjs/swagger';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

export class FavsDto {
  @ApiProperty()
  artists: Artist[];
  @ApiProperty()
  albums: Album[];
  @ApiProperty()
  tracks: Track[];
  constructor() {
    this.artists = new Array<Artist>();
    this.albums = new Array<Album>();
    this.tracks = new Array<Track>();
  }
}
