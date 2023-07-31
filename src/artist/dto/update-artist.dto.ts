//import { PartialType } from '@nestjs/swagger';
//import { CreateArtistDto } from './create-artist.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

//export class UpdateArtistDto extends PartialType(CreateArtistDto) {
export class UpdateArtistDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  grammy: boolean;
}
