import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import * as uuid from 'uuid';
import { FavArtist } from 'src/favs/entities/fav_artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly repository: Repository<Artist>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateArtistDto): Promise<Artist | null> {
    const artist = new Artist();
    artist.id = uuid.v4();
    Object.assign(artist, dto);
    await this.repository.insert(artist);
    const id = artist.id;
    const a = await this.repository.findOneBy({ id });
    return a;
  }

  findAll(): Promise<Artist[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Artist | null> {
    if (uuid.validate(id)) {
      return await this.repository.findOneBy({ id });
    } else {
      return null;
    }
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist | null> {
    if (uuid.validate(id)) {
      const artist = await this.repository.findOneBy({ id });
      if (!artist) return null;
      if (dto.name) artist.name = dto.name;
      if (!(dto.grammy === undefined)) artist.grammy = dto.grammy;
      await this.repository.update({ id }, artist);
      return artist;
    } else {
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    const artist = await this.repository.findOneBy({ id });

    if (artist == null) {
      return false;
    }

    await this.dataSource
      .getRepository(Album)
      .update({ artistId: id }, { artist: null, artistId: null });
    await this.dataSource
      .getRepository(Track)
      .update({ artistId: id }, { artist: null, artistId: null });
    await this.dataSource.getRepository(FavArtist).delete({ id });
    await this.repository.delete(id);

    return true;
  }
}
