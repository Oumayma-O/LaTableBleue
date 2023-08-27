import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsString,
  IsArray,
  IsUrl,
  IsOptional, ValidateNested, IsMongoId
} from "class-validator";
import { Type } from 'class-transformer';
import { ObjectId } from "mongodb";

export class CreateRatingDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  foodRating: number; // Rating given by the user for the restaurant.

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  serviceRating: number; // Rating given by the user for the restaurant.

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  ambianceRating: number; // Rating given by the user for the restaurant.
}

export class CreateReviewDto {
  @IsNotEmpty()
  @IsMongoId()
  restaurant: ObjectId; // Restaurant ID being reviewed.

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateRatingDto)
  rating: CreateRatingDto;

  @IsOptional()
  @IsString()
  comment?: string; // User's comment or review about the restaurant.

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[]; // URLs to images uploaded by the user as part of the review.
}
