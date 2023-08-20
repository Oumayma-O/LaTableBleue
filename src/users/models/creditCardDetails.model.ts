import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CreditCardDetailsDocument = CreditCardDetails & Document;

@Schema()
export class CreditCardDetails {
  @Prop({ required: true })
  cardNumber: string;

  @Prop({ required: true })
  expiryDate: string;

  @Prop({ required: true })
  cvv: string;

  constructor(partial: Partial<CreditCardDetails>) {
    Object.assign(this, partial);
  }
}

export const CreditCardDetailsSchema =
  SchemaFactory.createForClass(CreditCardDetails);
