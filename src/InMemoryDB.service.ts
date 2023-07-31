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
import { Fav } from './favs/entities/fav.entity';
import { FavsDto } from './favs/dto/favs.dto';

@Injectable()
export class ImDbService implements DataBaseInterface {
  users: Map<string, User>;
  artists: Map<string, Artist>;
  albums: Map<string, Album>;
  tracks: Map<string, Track>;
  favs: Fav;

  constructor() {
    this.users = new Map<string, User>();
    this.artists = new Map<string, Artist>();
    this.albums = new Map<string, Album>();
    this.tracks = new Map<string, Track>();
    this.favs = new Fav();
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
    this.albums.forEach((album) => {
      if (album && album.artistId === id) {
        album.artistId = null;
      }
    });
  }

  delArtistFromTracks(id: string) {
    this.tracks.forEach((track) => {
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
    this.tracks.forEach((track) => {
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

  getFavs(): FavsDto {
    const dto = new FavsDto();
    this.favs.albums.forEach((albumId) => {
      const album = this.albums.get(albumId);
      if (album) dto.albums.push(album);
    });
    this.favs.artists.forEach((artistId) => {
      const artist = this.artists.get(artistId);
      if (artist) dto.artists.push(artist);
    });
    this.favs.tracks.forEach((trackId) => {
      const track = this.tracks.get(trackId);
      if (track) dto.tracks.push(track);
    });
    return dto;
  }

  favsAddTrack(id: string): boolean {
    if (
      this.favs.tracks.find((trackId) => {
        return trackId === id;
      })
    ) {
      return true;
    }
    const track = this.tracks.get(id);
    if (track) {
      this.favs.tracks.push(id);
      return true;
    }
    return false;
  }

  favsRemoveTrack(id: string): boolean {
    const trackIdx = this.favs.tracks.findIndex((trackId) => {
      return trackId === id;
    });
    if (trackIdx === -1) return false;
    this.favs.tracks.splice(trackIdx, 1);
    return true;
  }

  favsAddArtist(id: string): boolean {
    if (
      this.favs.artists.find((artistId) => {
        return artistId === id;
      })
    ) {
      return true;
    }
    const artist = this.artists.get(id);
    if (artist) {
      this.favs.artists.push(id);
      return true;
    }
    return false;
  }

  favsRemoveArtist(id: string): boolean {
    const artistIdx = this.favs.artists.findIndex((artistId) => {
      return artistId === id;
    });
    if (artistIdx === -1) return false;
    this.favs.artists.splice(artistIdx, 1);
    return true;
  }

  favsAddAlbum(id: string): boolean {
    if (
      this.favs.albums.find((albumId) => {
        return albumId === id;
      })
    ) {
      return true;
    }
    const album = this.albums.get(id);
    if (album) {
      this.favs.albums.push(id);
      return true;
    }
    return false;
  }

  favsRemoveAlbum(id: string): boolean {
    const albumIdx = this.favs.albums.findIndex((albumId) => {
      return albumId === id;
    });
    if (albumIdx === -1) return false;
    this.favs.albums.splice(albumIdx, 1);
    return true;
  }
}
