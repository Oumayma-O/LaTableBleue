import { IsString } from 'class-validator';

export class UpdateCreditCardDetailsDto {
  @IsString()
  cardNumber: string;

  @IsString()
  expiryDate: string;

  @IsString()
  cvv: string;
}
