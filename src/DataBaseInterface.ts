import { User } from './user/entities/user.entity';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UpdateUserDto } from './user/dto/update-user.dto';
import { Artist } from './artist/entities/artist.entity';
import { CreateArtistDto } from './artist/dto/create-artist.dto';
import { UpdateArtistDto } from './artist/dto/update-artist.dto';
import { Album } from './album/entities/album.entity';
import { CreateAlbumDto } from './album/dto/create-album.dto';
import { UpdateAlbumDto } from './album/dto/update-album.dto';

export interface DataBaseInterface {
  getUsers(): User[];
  getUser(id: string): User;
  addUser(dto: CreateUserDto): User;
  updateUser(id: string, dto: UpdateUserDto): User;
  delUser(id: string): boolean;

  getArtists(): Artist[];
  getArtist(id: string): Artist;
  addArtist(dto: CreateArtistDto): Artist;
  updateArtist(id: string, dto: UpdateArtistDto): Artist;
  delArtist(id: string): boolean;

  getAlbums(): Album[];
  getAlbum(id: string): Album;
  addAlbum(dto: CreateAlbumDto): Album;
  updateAlbum(id: string, dto: UpdateAlbumDto): Album;
  delAlbum(id: string): boolean;
}
