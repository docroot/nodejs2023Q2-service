// import { PartialType } from '@nestjs/swagger';
// import { CreateTrackDto } from './create-track.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  //   IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsUUID,
} from 'class-validator';

//export class UpdateTrackDto extends PartialType(CreateTrackDto) {
export class UpdateTrackDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
  @ApiProperty()
  @IsOptional()
  @IsUUID('4')
  artistId: string;
  @ApiProperty()
  @IsOptional()
  @IsUUID('4')
  albumId: string;
  @ApiProperty()
  @IsOptional()
  @IsInt()
  duration: number;
}
