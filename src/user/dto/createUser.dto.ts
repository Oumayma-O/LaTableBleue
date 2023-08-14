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
import {  Gender } from 'src/user/user.model';

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


  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  password: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;


  @IsNotEmpty()
  @IsNumber()
  @Min(18,{ message: 'Age should be at least 18' })
  age: number;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;

  @IsOptional()
  @IsString()
  address?: string;


  @IsOptional()
  @IsUrl()
  @IsString()
  avatar?: string;
}
