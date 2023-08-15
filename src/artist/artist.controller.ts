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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Response } from 'express';
import { UUIDParam } from 'src/UUIdParam';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const artist = this.artistService.findOne(id);
    if (!artist) {
      res.status(HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  @Put(':id')
  update(
    @UUIDParam('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // if (
    //   (updateArtistDto.name === undefined || updateArtistDto.name.length) &&
    //   updateArtistDto.name === undefined
    // ) {
    //   res.status(HttpStatus.BAD_REQUEST);
    //   return null;
    // }
    const artist = this.artistService.findOne(id);
    if (!artist) {
      res.status(HttpStatus.NOT_FOUND);
      return null;
    }

    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  remove(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (this.artistService.remove(id)) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }
}
