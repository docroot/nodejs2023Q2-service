import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ImDbService } from 'src/InMemoryDB.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ImDbService],
})
export class UserModule {}
