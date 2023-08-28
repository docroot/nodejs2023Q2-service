import { Controller, Delete, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsDto } from './dto/favs.dto';
import { Response } from 'express';
import { UUIDParam } from 'src/UUIdParam';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  async getFavs(): Promise<FavsDto | null> {
    return await this.favsService.getFavs();
  }

  @Post('track/:id')
  async addTrack(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (await this.favsService.addTrack(id)) {
      res.status(HttpStatus.CREATED);
    } else {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Delete('track/:id')
  async removeTrack(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (await this.favsService.removeTrack(id)) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }

  @Post('artist/:id')
  async addArtist(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (await this.favsService.addArtist(id)) {
      res.status(HttpStatus.CREATED);
    } else {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Delete('artist/:id')
  async removeArtist(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (await this.favsService.removeArtist(id)) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }

  @Post('album/:id')
  async addAlbum(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (await this.favsService.addAlbum(id)) {
      res.status(HttpStatus.CREATED);
    } else {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Delete('album/:id')
  async removeAlbum(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (await this.favsService.removeAlbum(id)) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }
}
