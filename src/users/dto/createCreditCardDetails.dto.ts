import { IsCreditCard, IsNotEmpty, IsString } from "class-validator";

export class UpdateCreditCardDetailsDto {

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
