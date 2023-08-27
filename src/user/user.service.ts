import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as uuid from 'uuid';
import { AuthInfo } from 'src/auth/entities/authinfo.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateUserDto): Promise<User | null> {
    const timestamp = new Date().getTime();
    const user = new User({
      id: uuid.v4(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await this.repository.insert(user);
    const id = user.id;
    const u = await this.repository.findOneBy({ id });
    return u;
  }

  findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  async findOneByLogin(login: string): Promise<User | null> {
    Logger.debug('User.findOneByLogin()');
    return await this.repository.findOneBy({ login });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User | null> {
    if (uuid.validate(id)) {
      const user = await this.repository.findOneBy({ id });
      if (!user || !dto.newPassword) return null;
      user.password = dto.newPassword;
      user.version++;
      user.updatedAt = new Date().getTime();
      await this.repository.update({ id }, user);
      return user;
    } else {
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    const user = await this.repository.findOneBy({ id });

    if (user == null) {
      return false;
    }
    await this.dataSource.getRepository(AuthInfo).delete(id);
    await this.repository.delete(id);

    return true;
  }
}
