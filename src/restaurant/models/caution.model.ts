import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class Caution extends Document {
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

  constructor(partial: Partial<Caution>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export const CautionSchema = SchemaFactory.createForClass(Caution);
