import {
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsPhoneNumber,
  IsDate,
  Matches,
} from 'class-validator';
import { ProfileType, Gender } from 'src/user/user.model';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/(?=[^\d].*)^[\w]{4,}$/, {
    message:
      'the first character of the username must not be a number. Username must contains at least 4 characters',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsNotEmpty()
  @IsEnum(ProfileType)
  role: ProfileType.CLIENT;

  @IsNotEmpty()
  @IsDate()
  birthdate: Date;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  avatar: string;
}
