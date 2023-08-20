import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FavsDto } from './dto/favs.dto';
import { Album } from 'src/album/entities/album.entity';
import { FavAlbum } from './entities/fav_album.entity';
import { FavArtist } from './entities/fav_artist.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { FavTrack } from './entities/fav_track.entity';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class FavsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getFavs(): Promise<FavsDto | null> {
    const dto = new FavsDto();

    const artists = await this.dataSource
      .getRepository(FavArtist)
      .find({ relations: { artist: true } });
    dto.artists = artists.map((fa) =>
      Artist.create(fa.artist.id, fa.artist.name, fa.artist.grammy),
    );

    const albums = await this.dataSource
      .getRepository(FavAlbum)
      .find({ relations: { album: true } });
    dto.albums = albums.map((fa) =>
      Album.create(
        fa.album.id,
        fa.album.name,
        fa.album.year,
        fa.album.artistId,
      ),
    );

    const tracks = await this.dataSource
      .getRepository(FavTrack)
      .find({ relations: { track: true } });
    dto.tracks = tracks.map((ft) =>
      Track.create(
        ft.track.id,
        ft.track.name,
        ft.track.duration,
        ft.track.artistId,
        ft.track.albumId,
      ),
    );
    return dto;
  }

  async addTrack(id: string): Promise<boolean> {
    const ft = await this.dataSource.getRepository(FavTrack).findOneBy({ id });
    if (ft) {
      return false;
    }
    if (
      (await this.dataSource.getRepository(Track).findOneBy({ id })) === null
    ) {
      return false;
    }

    const newFt = new FavTrack();
    newFt.id = id;
    if (await this.dataSource.getRepository(FavTrack).insert(newFt)) {
      return true;
    }

    return false;
  }

  async removeTrack(id: string): Promise<boolean> {
    const ft = this.dataSource.getRepository(FavTrack).findBy({ id });
    if (ft === null) {
      return false;
    }
    await this.dataSource.getRepository(FavTrack).delete(id);
    return true;
  }

  async addArtist(id: string): Promise<boolean> {
    const fa = await this.dataSource.getRepository(FavArtist).findOneBy({ id });
    if (fa) {
      return false;
    }
    if (
      (await this.dataSource.getRepository(Artist).findOneBy({ id })) === null
    ) {
      return false;
    }
    const newFa = new FavArtist();
    newFa.id = id;
    // newFa.artist = artist;
    // Logger.log(JSON.stringify(artist));
    Logger.log(JSON.stringify(newFa));
    if (await this.dataSource.getRepository(FavArtist).insert(newFa)) {
      return true;
    }

    return false;
  }

  async removeArtist(id: string): Promise<boolean> {
    const fa = this.dataSource.getRepository(FavArtist).findBy({ id });
    if (fa === null) {
      return false;
    }
    await this.dataSource.getRepository(FavArtist).delete(id);
    return true;
  }

  async addAlbum(id: string): Promise<boolean> {
    const fa = await this.dataSource.getRepository(FavAlbum).findOneBy({ id });
    if (fa) {
      return true;
    }
    if (
      (await this.dataSource.getRepository(Album).findOneBy({ id })) === null
    ) {
      return false;
    }
    const newFa = new FavAlbum();
    newFa.id = id;
    if (await this.dataSource.getRepository(FavAlbum).insert(newFa))
      return true;
    else return false;
  }

  async removeAlbum(id: string): Promise<boolean> {
    const fa = this.dataSource.getRepository(FavAlbum).findBy({ id });
    if (fa === null) {
      return false;
    }
    await this.dataSource.getRepository(FavAlbum).delete(id);
    return true;
  }
}
