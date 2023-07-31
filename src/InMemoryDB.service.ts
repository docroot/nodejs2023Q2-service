import { DataBaseInterface } from './DataBaseInterface';
import { User } from './user/entities/user.entity';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UpdateUserDto } from './user/dto/update-user.dto';
import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './artist/dto/create-artist.dto';
import { UpdateArtistDto } from './artist/dto/update-artist.dto';
import { Artist } from './artist/entities/artist.entity';
import { CreateAlbumDto } from './album/dto/create-album.dto';
import { UpdateAlbumDto } from './album/dto/update-album.dto';
import { Album } from './album/entities/album.entity';
import { Track } from './track/entities/track.entity';
import { UpdateTrackDto } from './track/dto/update-track.dto';
import { CreateTrackDto } from './track/dto/create-track.dto';

@Injectable()
export class ImDbService implements DataBaseInterface {
  users: Map<string, User>;
  artists: Map<string, Artist>;
  albums: Map<string, Album>;
  tracks: Map<string, Track>;

  constructor() {
    this.users = new Map<string, User>();
    this.artists = new Map<string, Artist>();
    this.albums = new Map<string, Album>();
    this.tracks = new Map<string, Track>();
  }

  getUsers(): User[] {
    const res = new Array<User>(...this.users.values());
    return res;
  }

  getUser(id: string): User {
    if (uuid.validate(id)) {
      return this.users.get(id);
    } else {
      return null;
    }
  }

  addUser(dto: CreateUserDto): User {
    const timestamp = new Date().getTime();
    const user = new User({
      id: uuid.v4(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    this.users.set(user.id, user);

    return user;
  }

  updateUser(id: string, dto: UpdateUserDto): User {
    if (uuid.validate(id)) {
      const user = this.users.get(id);
      if (!user || !dto.newPassword) return null;
      user.password = dto.newPassword;
      user.version++;
      user.updatedAt = new Date().getTime();
      return user;
    } else {
      return null;
    }
  }

  delUser(id: string): boolean {
    if (uuid.validate(id)) {
      const user = this.users.get(id);
      if (!user) return null;
      this.users.delete(id);
      return true;
    } else {
      return false;
    }
  }

  getArtists(): Artist[] {
    const res = new Array<Artist>(...this.artists.values());
    return res;
  }

  getArtist(id: string): Artist {
    if (uuid.validate(id)) {
      return this.artists.get(id);
    } else {
      return null;
    }
  }

  addArtist(dto: CreateArtistDto): Artist {
    const artist = new Artist();
    artist.id = uuid.v4();
    Object.assign(artist, dto);
    this.artists.set(artist.id, artist);
    return artist;
  }

  updateArtist(id: string, dto: UpdateArtistDto): Artist {
    if (uuid.validate(id)) {
      const artist = this.artists.get(id);
      if (!artist) return null;
      if (dto.name) artist.name = dto.name;
      if (!(dto.grammy === undefined)) artist.grammy = dto.grammy;
      return artist;
    } else {
      return null;
    }
  }

  delArtist(id: string): boolean {
    if (uuid.validate(id)) {
      const artist = this.artists.get(id);
      if (!artist) return null;
      this.delArtistFromAlbums(id);
      this.delArtistFromTracks(id);
      this.artists.delete(id);
      return true;
    } else {
      return false;
    }
  }

  delArtistFromAlbums(id: string) {
    this.albums.forEach((album, albumId) => {
      if (album && album.artistId === id) {
        album.artistId = null;
      }
    });
  }

  delArtistFromTracks(id: string) {
    this.tracks.forEach((track, trakckId) => {
      if (track && track.artistId === id) {
        track.artistId = null;
      }
    });
  }

  getAlbums(): Album[] {
    const res = new Array<Album>(...this.albums.values());
    return res;
  }

  getAlbum(id: string): Album {
    if (uuid.validate(id)) {
      return this.albums.get(id);
    } else {
      return null;
    }
  }

  addAlbum(dto: CreateAlbumDto): Album {
    const album = new Album();
    album.id = uuid.v4();
    Object.assign(album, dto);
    this.albums.set(album.id, album);
    return album;
  }

  updateAlbum(id: string, dto: UpdateAlbumDto): Album {
    if (uuid.validate(id)) {
      const album = this.albums.get(id);
      if (!album) return null;
      if (!(dto.artistId === undefined)) {
        const artist = this.getArtist(dto.artistId);
        if (!artist) {
          return null;
        }
        album.artistId = dto.artistId;
      }
      if (dto.name) album.name = dto.name;
      if (dto.year) album.year = dto.year;
      return album;
    } else {
      return null;
    }
  }

  delAlbum(id: string): boolean {
    if (uuid.validate(id)) {
      const album = this.albums.get(id);
      if (!album) return null;
      this.delAlbumFromTracks(id);
      this.albums.delete(id);
      return true;
    } else {
      return false;
    }
  }

  delAlbumFromTracks(id: string) {
    this.tracks.forEach((track, trakckId) => {
      if (track && track.albumId === id) {
        track.albumId = null;
      }
    });
  }

  getTracks(): Track[] {
    const res = new Array<Track>(...this.tracks.values());
    return res;
  }

  getTrack(id: string): Track {
    if (uuid.validate(id)) {
      return this.tracks.get(id);
    } else {
      return null;
    }
  }

  addTrack(dto: CreateTrackDto): Track {
    const track = new Track();
    track.id = uuid.v4();
    Object.assign(track, dto);
    this.tracks.set(track.id, track);
    return track;
  }

  updateTrack(id: string, dto: UpdateTrackDto): Track {
    if (uuid.validate(id)) {
      const track = this.tracks.get(id);
      if (!track) return null;
      if (dto.artistId) {
        const artist = this.getArtist(dto.artistId);
        if (!artist) {
          return null;
        }
        track.artistId = dto.artistId;
      }
      if (dto.albumId) {
        const album = this.getAlbum(dto.albumId);
        if (!album) {
          return null;
        }
        track.artistId = dto.artistId;
      }
      if (dto.name) track.name = dto.name;
      if (dto.duration) track.duration = dto.duration;
      return track;
    } else {
      return null;
    }
  }

  delTrack(id: string): boolean {
    if (uuid.validate(id)) {
      const track = this.tracks.get(id);
      if (!track) return null;
      this.tracks.delete(id);
      return true;
    } else {
      return false;
    }
  }
}
