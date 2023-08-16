import {
  IsString,
  IsEmail,
  IsUrl,
  IsOptional,
  Matches,
} from 'class-validator';

export class updateAdminDto {
  @IsOptional()
  @IsString()
  @Matches(/(?=[^\d].*)^[\w]{4,}$/, {
    message:
      'the first character of the username must not be a number. Username must contains at least 4 characters',
  })
  username: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  avatar: string;
}
