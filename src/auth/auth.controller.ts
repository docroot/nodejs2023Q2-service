import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Body() dto: CreateUserDto,
    //    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signUp(dto);
    Logger.debug(`SignUP() user: [${JSON.stringify(user)}]`);
    if (user === null) {
      res.status(HttpStatus.BAD_REQUEST);
    } else {
      res.status(HttpStatus.CREATED);
    }
    return user;
  }
}
