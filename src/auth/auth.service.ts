import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DataSource } from 'typeorm';
import { AuthInfo } from './entities/authinfo.entity';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async signUp(dto: CreateUserDto): Promise<User | null> {
    const user = await this.userService.findOneByLogin(dto.login);
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

    return await this.createTokens(user);
  }

  async refresh(refreshToken: string): Promise<any> {
    try {
      // I am not sure, but probably we have to compare received token with the token form our DB
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.jwtSecretKey,
      });
      const user = await this.userService.findOneByLogin(payload.username);
      if (user === null) {
        throw new Error();
      }
      return await this.createTokens(user);
    } catch (error) {
      Logger.debug(`TOKEN ERROR: ${error.message}`);
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }
  }

  async createTokens(user: User): Promise<any> {
    const payload = { sub: user.id, username: user.login };
    const authInfo = new AuthInfo();
    authInfo.id = user.id;
    authInfo.accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: jwtConstants.tokenExpireTime,
    });
    authInfo.refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: jwtConstants.tokenRefreshExpireTime,
    });

    await this.dataSource.manager.getRepository(AuthInfo).save(authInfo);

    Logger.debug(`ACCESS TOKEN: [${authInfo.accessToken}]`);
    Logger.debug(`REFRESH TOKEN: [${authInfo.refreshToken}]`);

    return {
      accessToken: authInfo.accessToken,
      refreshToken: authInfo.refreshToken,
    };
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
    const hash = await bcrypt.hash(password, jwtConstants.cryptSalt);
    return hash;
  }
}
