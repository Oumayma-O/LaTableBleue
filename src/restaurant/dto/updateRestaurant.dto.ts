import {
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
import { UpdateCautionDto } from './caution.dto';
import { Cuisine, MealType, RestaurantFeature } from '../models/enums';
import { SocialLinksDto } from './socialLinks.dto';
import { UpdateAddressDto } from './Address.dto';

export class UpdateRestaurantDto {
  @IsString()
  restaurantName: string;

  @IsNumber()
  tableNumber: number;

  @IsEnum(Cuisine)
  cuisine: Cuisine;

  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number;

  @IsPhoneNumber()
  RestaurantPhoneNumber: string;

  @IsNumber()
  averagePrice: number;

  @IsString()
  description: string;

  @IsArray()
  @IsEnum(MealType, { each: true })
  meals: MealType[];

  @IsArray()
  @IsEnum(RestaurantFeature, { each: true })
  features: RestaurantFeature[];

  @IsArray()
  @IsString({ each: true })
  restaurantImages: string[];

  @ValidateNested()
  @Type(() => UpdateCautionDto)
  caution: UpdateCautionDto;

  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address: UpdateAddressDto;

  @IsUrl()
  websiteLink: string;

  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks: SocialLinksDto;
}
