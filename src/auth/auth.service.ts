import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
    return await this.userService.create(dto);
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByLogin(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.login };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
