import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { DbModule } from './db/db.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [UserModule, ArtistModule, AlbumModule, DbModule, TrackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
