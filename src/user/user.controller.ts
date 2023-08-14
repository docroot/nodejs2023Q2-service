import {
  Controller,
  Get,
  Post,
  Put,
  Body,
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
  async findOne(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.findOne(id);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @UUIDParam('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.findOne(id);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND);
      return false;
    }
    if (updateUserDto.oldPassword !== user.password) {
      res.status(HttpStatus.FORBIDDEN);
      return false;
    }

    const u = await this.userService.update(id, updateUserDto);
    return u;

  }

  @Delete(':id')
  async remove(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.userService.remove(id);

    if (result) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }
}
