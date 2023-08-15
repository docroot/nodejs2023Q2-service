import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [FavsController],
  providers: [FavsService],
  imports: [DbModule],
})
export class FavsModule {}
