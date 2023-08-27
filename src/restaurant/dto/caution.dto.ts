import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateCautionDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  fixedAmount: number;

  @IsNumber()
  @IsPositive()
  weekendMultiplier?: number;

  @IsNumber()
  @IsPositive()
  specialOccasionMultiplier?: number;

  @IsNumber()
  @IsPositive()
  partySizeMultiplier?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  paymentDelay: number; // In hours
}

export class UpdateCautionDto {
  @IsNumber()
  @IsPositive()
  fixedAmount?: number;

  @IsNumber()
  @IsPositive()
  weekendMultiplier?: number;

  @IsNumber()
  @IsPositive()
  specialOccasionMultiplier?: number;

  @IsNumber()
  @IsPositive()
  partySizeMultiplier?: number;

  @IsNumber()
  @IsPositive()
  paymentDelay?: number; // In hours
}
