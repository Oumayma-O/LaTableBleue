import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';
import { Gender } from 'src/user/user.model';

export class UpdateUserBioDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

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
