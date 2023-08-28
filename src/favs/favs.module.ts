import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavArtist } from './entities/fav_artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FavArtist])],
  controllers: [FavsController],
  providers: [FavsService],
})
export class FavsModule {}
