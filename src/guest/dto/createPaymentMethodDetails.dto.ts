import { IsCreditCard, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethodType } from '../models/PaymentMethodDetails.model';

export class CreatePaymentMethodDetailsDto {
  @IsNotEmpty()
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @IsNotEmpty()
  @IsCreditCard()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  nameOnCard: string;

  @IsString()
  @IsNotEmpty()
  expiryDate: string;

  @IsString()
  @IsNotEmpty()
  cvv: string;
}
