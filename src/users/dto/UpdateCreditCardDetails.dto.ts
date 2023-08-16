import { IsCreditCard, IsOptional, IsString } from "class-validator";

export class UpdateCreditCardDetailsDto {

  @IsOptional()
  @IsCreditCard()
  cardNumber: string;

  @IsOptional()
  @IsCreditCard()
  expiryDate: string;


  @IsOptional()
  @IsCreditCard()
  cvv: string;
}
