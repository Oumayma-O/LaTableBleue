import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'you need to enter your firstname' })
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'First name must contain only letters' })
  firstName: string;

  @IsNotEmpty({ message: 'you need to enter your lastname' })
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Last name must contain only letters' })
  lastName: string;

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

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;
}
