import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CautionDocument = Caution & Document;

@Schema()
export class Caution {
  @Prop({ required: true })
  fixedAmount: number;

  @Prop({ default: 1.2 })
  weekendMultiplier: number;

  @Prop({ default: 1.5 })
  specialOccasionMultiplier: number;

  @Prop({ default: 1.1 })
  partySizeMultiplier: number;

  @Prop({ required: true })
  paymentDelay: number; // In hours
}

export const CautionSchema = SchemaFactory.createForClass(Caution);
