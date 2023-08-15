import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Response } from 'express';
import { UUIDParam } from 'src/UUIdParam';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const album = this.albumService.findOne(id);
    if (!album) {
      res.status(HttpStatus.NOT_FOUND);
    }

    return album;
  }

  @Put(':id')
  update(
    @UUIDParam('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const album = this.albumService.findOne(id);
    if (!album) {
      res.status(HttpStatus.NOT_FOUND);
      return null;
    }

    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  remove(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (this.albumService.remove(id)) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }
}
