import { IsCreditCard, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentMethodDetailsDto {
  @IsOptional()
  @IsCreditCard()
  cardNumber: string;

  @IsString()
  @IsOptional()
  nameOnCard: string;

  @IsOptional()
  @IsCreditCard()
  expiryDate: string;

  @IsOptional()
  @IsCreditCard()
  cvv: string;
}
