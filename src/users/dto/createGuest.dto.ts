import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

import { CreateUserDto } from './createUser.dto';

export class CreateClientDto extends CreateUserDto {
  @IsNotEmpty()
  @IsDate()
  birthdate: Date;

  @IsOptional()
  @IsString()
  address: string;
}
