import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import * as uuid from 'uuid';
import { Album } from 'src/album/entities/album.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly repository: Repository<Track>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateTrackDto): Promise<Track | null> {
    const track = new Track();
    track.id = uuid.v4();
    Object.assign(track, dto);
    await this.repository.insert(track);
    const id = track.id;
    return await this.repository.findOneBy({ id });
  }

  findAll(): Promise<Track[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Track | null> {
    if (uuid.validate(id)) {
      return await this.repository.findOneBy({ id });
    } else {
      return null;
    }
  }

  async update(id: string, dto: UpdateTrackDto) {
    if (uuid.validate(id)) {
      const track = await this.repository.findOneBy({ id });
      if (!track) return null;
      if (!(dto.artistId === undefined)) {
        const artist = await this.dataSource
          .getRepository(Artist)
          .findOneBy({ id: dto.artistId });
        if (!artist) {
          return null;
        }
        track.artistId = dto.artistId;
      }
      if (!(dto.albumId === undefined)) {
        const album = await this.dataSource
          .getRepository(Album)
          .findOneBy({ id: dto.albumId });
        if (!album) {
          return null;
        }
        track.albumId = dto.albumId;
      }
      if (dto.name) track.name = dto.name;
      if (dto.duration) track.duration = dto.duration;
      await this.repository.update({ id }, track);
      return track;
    } else {
      return null;
    }
  }
  async remove(id: string): Promise<boolean> {
    const track = await this.repository.findOneBy({ id });

    if (track == null) {
      return false;
    }

    await this.repository.delete(id);

    return true;
  }
}
