import { DataBaseInterface } from './DataBaseInterface';
import { User } from './user/entities/user.entity';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UpdateUserDto } from './user/dto/update-user.dto';
import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImDbService implements DataBaseInterface {
  users: Map<string, User>;

  constructor() {
    this.users = new Map<string, User>();
  }

  getUsers(): User[] {
    const res = new Array<User>(...this.users.values());
    return res;
  }

  getUser(id: string): User {
    if (uuid.validate(id)) {
      return this.users.get(id);
    } else {
      return null;
    }
  }

  addUser(dto: CreateUserDto): User {
    const timestamp = new Date().getTime();
    const user = new User({
      id: uuid.v4(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    this.users.set(user.id, user);

    return user;
  }

  updateUser(id: string, dto: UpdateUserDto): User {
    if (uuid.validate(id)) {
      const user = this.users.get(id);
      if (!user || !dto.newPassword) return null;
      user.password = dto.newPassword;
      user.version++;
      user.updatedAt = new Date().getTime();
      return user;
    } else {
      return null;
    }
  }

  delUser(id: string): boolean {
    if (uuid.validate(id)) {
      const user = this.users.get(id);
      if (!user) return null;
      this.users.delete(id);
      return true;
    } else {
      return false;
    }
  }
}
