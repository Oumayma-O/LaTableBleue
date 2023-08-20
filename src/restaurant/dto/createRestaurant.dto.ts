import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsUrl,
  IsOptional,
  IsDate,
  IsEnum,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsMenuOrMenuImagesRequired } from '../IsMenuOrMenuImagesRequired.validator';
import { RestaurantFeature } from '../models/enums';

export class MenuItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class MenuCategoryDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @Type(() => MenuItemDto)
  @IsNotEmpty()
  items: MenuItemDto[];
}

export class IntervalsDto {
  @IsString()
  @IsNotEmpty()
  openingTime: string;

  @IsString()
  @IsNotEmpty()
  closingTime: string;
}

export class OperatingDayDto {
  @IsString()
  @IsNotEmpty()
  day: string;

  @IsArray()
  @Type(() => IntervalsDto)
  @IsNotEmpty()
  intervals: IntervalsDto[];
}

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cuisine: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number;

  @IsArray()
  @Type(() => MenuCategoryDto)
  @IsMenuOrMenuImagesRequired()
  menu?: MenuCategoryDto[];

  @IsArray()
  @IsString({ each: true })
  @IsMenuOrMenuImagesRequired()
  menuImages?: string[];

  @IsNumber()
  @IsNotEmpty()
  CancellationDeadline: number;

  @IsUrl()
  @IsOptional()
  websiteLink?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsNumber()
  @IsOptional()
  averagePrice?: number;

  @IsUrl()
  @IsOptional()
  mapsLink?: string;

  @IsUrl()
  @IsOptional()
  FbLink?: string;

  @IsUrl()
  @IsOptional()
  InstaLink?: string;

  @IsDate()
  @IsOptional()
  foundationDate?: Date;

  @IsArray()
  @Type(() => OperatingDayDto)
  @IsOptional()
  operatingHours?: OperatingDayDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  meals?: string[];

  @IsArray()
  @IsEnum(RestaurantFeature, { each: true })
  @IsOptional()
  features?: string[];

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  NumberOfTables: number;

  @IsNotEmpty({ message: 'Either menu or menuImages is required.' })
  isMenuOrMenuImagesRequired: string;
}
