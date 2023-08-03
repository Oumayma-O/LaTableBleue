import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CreditCardDetailsDocument = CreditCardDetails & Document;

@Schema()
export class CreditCardDetails {
  @Prop({ type: Types.ObjectId, default: Types.ObjectId }) // Use Types.ObjectId for _id
  _id: Types.ObjectId; // Use Types.ObjectId for _id

  @Prop({ required: true })
  cardNumber: string;

  @Prop({ required: true })
  expiryDate: string;

  @Prop({ required: true })
  cvv: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  constructor(partial: Partial<CreditCardDetails>) {
    Object.assign(this, partial);
  }
}

export const CreditCardDetailsSchema =
  SchemaFactory.createForClass(CreditCardDetails);
