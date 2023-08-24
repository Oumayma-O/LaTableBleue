import { IsNotEmpty, IsNumber, Min, Max, IsString, IsArray, IsUrl, IsOptional } from 'class-validator';

export class CreateReviewDto {
    @IsNotEmpty()
    @IsString()
    guest: string; // User ID of the guest who wrote the review.

    @IsNotEmpty()
    @IsString()
    restaurant: string; // Restaurant ID being reviewed.

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number; // Rating given by the user for the restaurant.

    @IsOptional()
    @IsString()
    comment?: string; // User's comment or review about the restaurant.

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    images?: string[]; // URLs to images uploaded by the user as part of the review.
}
