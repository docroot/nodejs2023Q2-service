import { Injectable } from '@nestjs/common';
import { ImDbService } from 'src/InMemoryDB.service';
import { FavsDto } from './dto/favs.dto';

@Injectable()
export class FavsService {
  constructor(private db: ImDbService) {
    this.db = db;
  }

  getFavs(): FavsDto {
    return this.db.getFavs();
  }

  addTrack(id: string): boolean {
    return this.db.favsAddTrack(id);
  }

  removeTrack(id: string): boolean {
    return this.db.favsRemoveTrack(id);
  }

  addArtist(id: string): boolean {
    return this.db.favsAddArtist(id);
  }

  removeArtist(id: string): boolean {
    return this.db.favsRemoveArtist(id);
  }

  addAlbum(id: string): boolean {
    return this.db.favsAddAlbum(id);
  }

  removeAlbum(id: string): boolean {
    return this.db.favsRemoveAlbum(id);
  }
}
