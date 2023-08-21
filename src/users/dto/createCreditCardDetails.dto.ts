import { IsCreditCard, IsNotEmpty, IsString } from 'class-validator';

export class CreateCreditCardDetailsDto {
  @IsNotEmpty()
  @IsCreditCard()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  expiryDate: string;

  @IsString()
  @IsNotEmpty()
  cvv: string;
}
