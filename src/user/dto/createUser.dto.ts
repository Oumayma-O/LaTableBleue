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

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

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
  @IsNumber()
  @Min(18)
  age: number;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;

  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  expiryDate: string;

  @IsNotEmpty()
  @IsString()
  cvv: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  avatar: string;
}
