import {
  IsString,
  IsEmail,
  IsUrl,
  IsOptional,
  Matches,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { Gender } from '../models/user.model';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Matches(/(?=[^\d].*)^[\w]{4,}$/, {
    message:
      'the first character of the username must not be a number. Username must contains at least 4 characters',
  })
  username: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'First name must contain only letters' })
  firstName: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Last name must contain only letters' })
  lastName: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  avatar: string;
}
