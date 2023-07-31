import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import * as uuid from 'uuid';
import { UUIDParam } from 'src/UUIdParam';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // if (!uuid.validate(id)) {
    //   res.status(HttpStatus.BAD_REQUEST);
    //   return null;
    // }
    const user = this.userService.findOne(id);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  update(
    @UUIDParam('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // if (!uuid.validate(id)) {
    //   res.status(HttpStatus.BAD_REQUEST);
    //   return null;
    // }
    // if (
    //   !updateUserDto.newPassword ||
    //   updateUserDto.newPassword.length === 0 ||
    //   !updateUserDto.newPassword ||
    //   updateUserDto.newPassword.length === 0
    // ) {
    //   res.status(HttpStatus.BAD_REQUEST);
    //   return null;
    // }
    const user = this.userService.findOne(id);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND);
      return null;
    }
    if (updateUserDto.oldPassword !== user.password) {
      res.status(HttpStatus.FORBIDDEN);
      return null;
    }

    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // if (!uuid.validate(id)) {
    //   res.status(HttpStatus.BAD_REQUEST);
    //   return;
    // }

    if (this.userService.remove(id)) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }
}
