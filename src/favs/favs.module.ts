import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavArtist } from './entities/fav_artist.entity';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [TypeOrmModule.forFeature([FavArtist]), DbModule],
  controllers: [FavsController],
  providers: [FavsService],
})
export class FavsModule {}
