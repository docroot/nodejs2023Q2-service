import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ImDbService } from 'src/InMemoryDB.service';
import * as uuid from 'uuid';

@Injectable()
export class AlbumService {
  constructor(private db: ImDbService) {
    this.db = db;
  }

  create(createAlbumDto: CreateAlbumDto) {
    return this.db.addAlbum(createAlbumDto);
  }

  findAll() {
    return this.db.getAlbums();
  }

  findOne(id: string) {
    if (uuid.validate(id)) {
      return this.db.getAlbum(id);
    } else {
      return null;
    }
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return this.db.updateAlbum(id, updateAlbumDto);
  }

  remove(id: string) {
    return this.db.delAlbum(id);
  }
}
