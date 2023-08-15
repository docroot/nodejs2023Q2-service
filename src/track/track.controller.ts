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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Response } from 'express';
import { UUIDParam } from 'src/UUIdParam';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const album = this.trackService.findOne(id);
    if (!album) {
      res.status(HttpStatus.NOT_FOUND);
    }
    return album;
  }

  @Put(':id')
  update(
    @UUIDParam('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const track = this.trackService.findOne(id);
    if (!track) {
      res.status(HttpStatus.NOT_FOUND);
      return null;
    }

    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  remove(
    @UUIDParam('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (this.trackService.remove(id)) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }
}
