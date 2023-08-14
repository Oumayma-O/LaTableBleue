import { IsNotEmpty, IsEmail, MinLength, IsPhoneNumber } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}
