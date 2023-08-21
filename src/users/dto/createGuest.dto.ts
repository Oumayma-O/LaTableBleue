import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  Matches,
} from 'class-validator';

import { CreateUserDto } from './createUser.dto';

export class CreateGuestDto extends CreateUserDto {
  @IsNotEmpty()
  @IsDate()
  birthdate: Date;

  @IsOptional()
  @IsString()
  @Matches(/^\d+\s+[\w\s.-]+,\s+[\w\s.-]+,\s+[\w\s.-]+$/, {
    message:
      'Address format should be like this: 15 Rue de la Liberté,La Marsa,Tunis',
  })
  address: string;
}
