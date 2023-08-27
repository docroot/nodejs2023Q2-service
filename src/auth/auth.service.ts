import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DataSource } from 'typeorm';
import { AuthInfo } from './entities/authinfo.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async signUp(dto: CreateUserDto): Promise<User | null> {
    Logger.debug(`SignUp()`);
    const user = await this.userService.findOneByLogin(dto.login);
    Logger.debug(
      `SignUp() login: [${dto.login}], user: [JSON.stringify(${user})]`,
    );
    if (user) {
      return null;
    }
    dto.password = await this.hashPassword(dto.password);
    return await this.userService.create(dto);
  }

  async signIn(dto: CreateUserDto): Promise<any> {
    const user = await this.userService.findOneByLogin(dto.login);
    if (!(user && (await bcrypt.compare(dto.password, user.password)))) {
      throw new UnauthorizedException();
    }

    const payload = { userid: user.id, username: user.login };
    let authInfo = await this.dataSource.manager
      .getRepository(AuthInfo)
      .findOneBy({ id: user.id });
    const curtime = new Date().getTime();
    if (authInfo == null) {
      authInfo = new AuthInfo();
      authInfo.id = user.id;
      authInfo.atCreatedAt = curtime;
      authInfo.rtCreatedAt = curtime;
      authInfo.accessToken = await this.jwtService.signAsync(payload);
      authInfo.refreshToken = await this.jwtService.signAsync(payload);
      await this.dataSource.manager.getRepository(AuthInfo).insert(authInfo);
      return {
        accessToken: authInfo.accessToken,
        refreshToken: authInfo.refreshToken,
      };
    } else {
      return {
        accessToken: authInfo.accessToken,
        refreshToken: authInfo.refreshToken,
      };
    }
  }

  async getAuthInfo(id: string): Promise<AuthInfo | null> {
    return await this.dataSource.getRepository(AuthInfo).findOneBy({ id });
  }

  async addAuthInfo(authInfo: AuthInfo): Promise<boolean> {
    const res = await this.dataSource.getRepository(AuthInfo).insert(authInfo);
    return !!res;
  }

  async updateAuthInfo(authInfo: AuthInfo): Promise<boolean> {
    const res = await this.dataSource
      .getRepository(AuthInfo)
      .update({ id: authInfo.id }, authInfo);
    return !!res;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
}
