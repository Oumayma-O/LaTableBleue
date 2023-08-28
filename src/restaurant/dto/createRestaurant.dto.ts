import {
  IsNotEmpty,
  IsString,
  IsEnum,
  Min,
  Max,
  IsPhoneNumber,
  IsNumber,
  IsUrl,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCautionDto } from './caution.dto';
import { Cuisine, MealType, RestaurantFeature } from '../models/enums';
import { CreateMenuDto } from './createMenu.dto';
import { SocialLinksDto } from './socialLinks.dto';
import { CreateAddressDto } from './Address.dto';
import { CreateOperatingHoursDto } from './createOperatingHours.dto';

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

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number;

  @IsPhoneNumber()
  RestaurantPhoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  averagePrice: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @Type(() => CreateMenuDto)
  menu: CreateMenuDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOperatingHoursDto)
  operatingHours: CreateOperatingHoursDto[];

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

  @IsUrl()
  websiteLink: string;

  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks: SocialLinksDto;
}
