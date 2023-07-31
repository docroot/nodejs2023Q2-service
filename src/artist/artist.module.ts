import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { ImDbService } from 'src/InMemoryDB.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, ImDbService],
})
export class ArtistModule {}
