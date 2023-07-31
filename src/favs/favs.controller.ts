import { Controller, Delete, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsDto } from './dto/favs.dto';
import { Response } from 'express';
import { UUIDParam } from 'src/UUIdParam';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  getFavs(): FavsDto {
    return this.favsService.getFavs();
  }

  @Post('track/:id')
  addTrack(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (this.favsService.addTrack(id)) {
      res.status(HttpStatus.CREATED);
    } else {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Delete('track/:id')
  removeTrack(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (this.favsService.removeTrack(id)) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }

  @Post('artist/:id')
  addArtist(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (this.favsService.addArtist(id)) {
      res.status(HttpStatus.CREATED);
    } else {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Delete('artist/:id')
  removeArtist(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (this.favsService.removeArtist(id)) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }

  @Post('album/:id')
  addAlbum(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (this.favsService.addAlbum(id)) {
      res.status(HttpStatus.CREATED);
    } else {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Delete('album/:id')
  removeAlbum(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (this.favsService.removeAlbum(id)) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }
}
