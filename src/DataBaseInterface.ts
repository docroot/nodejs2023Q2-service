import { User } from './user/entities/user.entity';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UpdateUserDto } from './user/dto/update-user.dto';

export interface DataBaseInterface {
  getUsers(): User[];
  getUser(id: string): User;
  addUser(dto: CreateUserDto): User;
  updateUser(id: string, dto: UpdateUserDto): User;
  delUser(id: string): boolean;
}
