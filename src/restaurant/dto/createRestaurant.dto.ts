import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsPhoneNumber,
  IsNumber,
  IsUrl,
  IsArray,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCautionDto } from './caution.dto';
import { Cuisine, MealType, RestaurantFeature } from '../models/enums';
import { SocialLinksDto } from './socialLinks.dto';
import { CreateAddressDto } from './Address.dto';
import { CreateOperatingHoursDto } from './createOperatingHours.dto';
import { CreateReservationDetailsDto } from './createReservationDetails.dto';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  restaurantName: string;

  @IsNotEmpty()
  @IsNumber()
  tableNumber: number;

  @IsNotEmpty()
  @IsEnum(Cuisine)
  cuisine: Cuisine;

  @IsPhoneNumber()
  RestaurantPhoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  averagePrice: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsDate()
  foundationDate: Date;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateOperatingHoursDto)
  operatingHours: CreateOperatingHoursDto;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(MealType, { each: true })
  meals: MealType[];

  @IsNotEmpty()
  @IsArray()
  @IsEnum(RestaurantFeature, { each: true })
  features: RestaurantFeature[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  restaurantImages: string[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateCautionDto)
  caution: CreateCautionDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateReservationDetailsDto)
  reservationDetails: CreateReservationDetailsDto;

  @IsUrl()
  websiteLink: string;

  @IsNotEmpty()
  @IsNumber()
  cancellationDeadline: number;

  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks: SocialLinksDto;
}
