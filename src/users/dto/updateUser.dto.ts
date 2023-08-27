import {
  IsString,
  IsEmail,
  IsUrl,
  IsOptional,
  Matches,
  IsPhoneNumber,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'First name must contain only letters' })
  firstName: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Last name must contain only letters' })
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  avatar: string;
}
