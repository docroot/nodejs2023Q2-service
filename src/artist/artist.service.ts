import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { ImDbService } from 'src/InMemoryDB.service';
import * as uuid from 'uuid';

@Injectable()
export class ArtistService {
  constructor(private db: ImDbService) {
    this.db = db;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    return this.db.addArtist(createArtistDto);
  }

  findAll(): Artist[] {
    return this.db.getArtists();
  }

  findOne(id: string): Artist {
    if (uuid.validate(id)) {
      return this.db.getArtist(id);
    } else {
      return null;
    }
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    return this.db.updateArtist(id, updateArtistDto);
  }

  remove(id: string): boolean {
    return this.db.delArtist(id);
  }
}
