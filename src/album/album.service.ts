import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import * as uuid from 'uuid';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly repository: Repository<Album>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateAlbumDto): Promise<Album | null> {
    const album = new Album();
    album.id = uuid.v4();
    Object.assign(album, dto);
    await this.repository.insert(album);
    const id = album.id;
    return await this.repository.findOneBy({ id });
  }

  findAll(): Promise<Album[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Album | null> {
    if (uuid.validate(id)) {
      return await this.repository.findOneBy({ id });
    } else {
      return null;
    }
  }

  async update(id: string, dto: UpdateAlbumDto) {
    if (uuid.validate(id)) {
      const album = await this.repository.findOneBy({ id });
      if (!album) return null;
      if (!(dto.artistId === undefined)) {
        const artist = await this.dataSource
          .getRepository(Artist)
          .findOneBy({ id: dto.artistId });
        if (!artist) {
          return null;
        }
        album.artistId = dto.artistId;
      }
      if (dto.name) album.name = dto.name;
      if (dto.year) album.year = dto.year;
      await this.repository.update({ id }, album);
      return album;
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
      .getRepository(Track)
      .update({ albumId: id }, { album: null, albumId: null });
    await this.repository.delete(id);

    return true;
  }
}
