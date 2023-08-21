import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class CreditCardDetails extends Document{
  @Prop({ required: true })
  cardNumber: string;

  @Prop({ required: true })
  expiryDate: string;

  @Prop({ required: true })
  cvv: string;

  constructor(partial: Partial<CreditCardDetails>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export const CreditCardDetailsSchema =
  SchemaFactory.createForClass(CreditCardDetails);
