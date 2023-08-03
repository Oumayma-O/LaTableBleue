// database/models/caution.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CautionDocument = Caution & Document;

@Schema()
export class Caution {
  @Prop({ type: Types.ObjectId, default: Types.ObjectId }) // Use Types.ObjectId for _id
  _id: Types.ObjectId; // Use Types.ObjectId for _id

  @Prop({ required: true })
  fixedAmount: number;

  @Prop({ default: 1.2 })
  weekendMultiplier: number;

  @Prop({ default: 1.5 })
  specialOccasionMultiplier: number;

  @Prop({ default: 1.1 })
  partySizeMultiplier: number;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Types.ObjectId;

  constructor(partial: Partial<Caution>) {
    Object.assign(this, partial);
  }
}

export const CautionSchema = SchemaFactory.createForClass(Caution);
