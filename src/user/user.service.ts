import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { DataBaseInterface } from 'src/DataBaseInterface';
import { ImDbService } from 'src/InMemoryDB.service';
import { User } from './entities/user.entity';
import * as uuid from 'uuid';

@Injectable()
export class UserService {
  constructor(private db: ImDbService) {
    this.db = db;
  }

  create(createUserDto: CreateUserDto): User {
    return this.db.addUser(createUserDto);
    // return 'This action adds a new user';
  }

  findAll(): User[] {
    return this.db.getUsers();
    //return `This action returns all user`;
  }

  findOne(id: string) {
    if (uuid.validate(id)) {
      return this.db.getUser(id);
    } else {
      return null;
    }
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    return this.db.updateUser(id, updateUserDto);
    // return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.db.delUser(id);
    return `This action removes a #${id} user`;
  }
}
