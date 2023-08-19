import {
  IsOptional,
  IsString,
  IsEnum,
  IsUrl,
  IsPhoneNumber,
  IsDate,
  Matches,
} from 'class-validator';
import { Gender } from '../models/user.model';

export class UpdateClientBioDto {
  @IsOptional()
  @IsString()
  @Matches(/(?=[^\d].*)^[\w]{4,}$/, {
    message:
      'the first character of the username must not be a number. Username must contains at least 4 characters',
  })
  username?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsDate()
  birthdate: Date;

  @IsOptional()
  @IsEnum(Gender)
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  avatar?: string;
}
