import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  addressLine: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  stateProvince: string;

  @IsNotEmpty()
  @IsNumber()
  zipCode: number;
}

export class UpdateAddressDto {
  @IsString()
  addressLine?: string;

  @IsString()
  city?: string;

  @IsString()
  stateProvince?: string;

  @IsNumber()
  zipCode?: number;
}
