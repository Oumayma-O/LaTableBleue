import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber, IsEnum, IsNumber, IsUrl, ValidateNested, ArrayMinSize, ArrayNotEmpty, IsArray, IsObject
} from "class-validator";
import { Type } from 'class-transformer';
import {Cuisine, MealType, RestaurantFeature} from "../models/enums";




class MenuItem {
  @IsString()
  name: string;

  @IsString()
  price: string;

  @IsString()
  description: string;

}

class MenuCategory {
  @IsString()
  category: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => MenuItem)
  items: MenuItem[];
}



class Caution {
  @IsNotEmpty()
  @IsNumber()
  fixedAmount: number;

  @IsOptional()
  @IsNumber()
  weekendMultiplier?: number;

  @IsOptional()
  @IsNumber()
  specialOccasionMultiplier?: number;

  @IsOptional()
  @IsNumber()
  partySizeMultiplier?: number;
}





class OperatingHourInterval {
  @IsString()
  @IsNotEmpty()
  openingTime: string;

  @IsString()
  @IsNotEmpty()
  closingTime: string;
}

class OperatingHour {
  @IsString()
  @IsNotEmpty()
  day: string;

  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => OperatingHourInterval)
  intervals: OperatingHourInterval[];
}







export class CreateRestaurantDto {

  @IsNotEmpty()
  @IsString()
  managerFirstName: string;

  @IsNotEmpty()
  @IsString()
  managerLastName: string;

  @IsNotEmpty()
  @IsEmail()
  managerEmail: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  managerPassword: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(Cuisine)
  cuisine: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MenuCategory)
  menu: MenuCategory[];


  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  images?: string[];

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Caution)
  caution: Caution;

  @IsNotEmpty()
  CancellationDeadline: number;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsNumber()
  averagePrice?: number;

  @IsOptional()
  @IsUrl()
  mapsLink?: string;

  @IsOptional()
  foundationDate?: Date;

  @IsOptional()
  @IsArray()
  @Type(() => OperatingHour)
  operatingHours?: OperatingHour[];

  @IsOptional()
  @IsArray()
  @IsEnum(MealType, { each: true })
  meals?: MealType[];

  @IsOptional()
  @IsArray()
  @IsEnum(RestaurantFeature, { each: true })
  features?: RestaurantFeature[];

}





