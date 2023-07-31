import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsUUID,
} from 'class-validator';

export class CreateTrackDto {
  @ApiProperty()
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsInt()
  duration: number;
}
