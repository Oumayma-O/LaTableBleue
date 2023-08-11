import {
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
  IsNumber,
  Min,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { ProfileType, Gender } from 'src/user/user.model';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(ProfileType)
  role: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  avatar: string;
}
