import { Module } from '@nestjs/common';
import { ImDbService } from 'src/InMemoryDB.service';

@Module({
  providers: [ImDbService],
  exports: [ImDbService],
})
export class DbModule {}
