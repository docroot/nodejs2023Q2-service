import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { ImDbService } from 'src/InMemoryDB.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, ImDbService],
})
export class AlbumModule {}
