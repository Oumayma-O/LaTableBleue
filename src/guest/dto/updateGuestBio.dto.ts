import { IsOptional, IsDate, IsAlphanumeric, Length } from 'class-validator';
import { UpdateUserDto } from '../../users/dto/updateUser.dto';
import { UpdateAddressDto } from '../../restaurant/dto/Address.dto';

export class UpdateGuestBioDto extends UpdateUserDto {
  @IsOptional()
  @Length(4, 25, {
    message: 'Review display name must be between 4 and 25 characters',
  })
  @IsAlphanumeric('en-US', {
    message: 'Review display name can only contain letters and numbers',
  })
  ReviewDisplayName?: string;

  @IsOptional()
  @IsDate()
  birthdate: Date;

  @IsOptional()
  address?: UpdateAddressDto;
}
