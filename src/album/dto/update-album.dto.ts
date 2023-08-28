// import { PartialType } from '@nestjs/swagger';
// import { CreateAlbumDto } from './create-album.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsUUID,
} from 'class-validator';

//export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {
export class UpdateAlbumDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsInt()
  year: number;
  @ApiProperty()
  @IsOptional()
  @IsUUID('4')
  artistId: string;
}
