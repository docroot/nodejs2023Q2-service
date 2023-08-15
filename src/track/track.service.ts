import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ImDbService } from 'src/InMemoryDB.service';
import * as uuid from 'uuid';

@Injectable()
export class TrackService {
  constructor(private db: ImDbService) {
    this.db = db;
  }

  create(createTrackDto: CreateTrackDto) {
    return this.db.addTrack(createTrackDto);
  }

  findAll() {
    return this.db.getTracks();
  }

  findOne(id: string) {
    if (uuid.validate(id)) {
      return this.db.getTrack(id);
    } else {
      return null;
    }
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    return this.db.updateTrack(id, updateTrackDto);
  }

  remove(id: string) {
    return this.db.delTrack(id);
  }
}
