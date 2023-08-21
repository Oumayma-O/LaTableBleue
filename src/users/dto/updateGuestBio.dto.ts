import { IsOptional, IsDate, IsString, Matches } from 'class-validator';
import { UpdateUserDto } from './updateUser.dto';

export class UpdateGuestBioDto extends UpdateUserDto {
  @IsOptional()
  @IsDate()
  birthdate: Date;

  @IsOptional()
  @IsString()
  @Matches(/^\d+\s+[\w\s.-]+,\s+[\w\s.-]+,\s+[\w\s.-]+$/, {
    message:
      'Address format should be like this: 15 Rue de la Liberté,La Marsa,Tunis',
  })
  address: string;
}
