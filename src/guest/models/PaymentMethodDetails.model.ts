import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  POSTCARD = 'postcard',
  // Add more types as needed
}

@Schema()
export class PaymentMethodDetails {
  @Prop({ required: true, enum: PaymentMethodType })
  type: PaymentMethodType;

  @Prop({ required: true })
  cardNumber: string;

  @Prop({ required: true })
  nameOnCard: string;

  @Prop({ required: true })
  expiryDate: string;

  @Prop({ required: true })
  cvv: string;

  constructor(partial: Partial<PaymentMethodDetails>) {
    Object.assign(this, partial);
  }
}

export type PaymentMethodDetailsDocument = PaymentMethodDetails & Document;
export const PaymentMethodDetailsSchema =
  SchemaFactory.createForClass(PaymentMethodDetails);
