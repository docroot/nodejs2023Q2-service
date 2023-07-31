import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  login: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
