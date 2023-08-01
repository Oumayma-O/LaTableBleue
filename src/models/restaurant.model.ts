// database/models/restaurant.model.ts

import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Caution, CautionSchema } from './caution.model';
import * as mongoose from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema()
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: true })
  cuisine: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ type: [String] })
  menu: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: string;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop(
    raw({
      monday: { type: String, default: 'Closed' },
      tuesday: { type: String, default: 'Closed' },
      wednesday: { type: String, default: 'Closed' },
      thursday: { type: String, default: 'Closed' },
      friday: { type: String, default: 'Closed' },
      saturday: { type: String, default: 'Closed' },
      sunday: { type: String, default: 'Closed' },
    }),
  )
  workingHours: Record<string, string>;

  @Prop({ type: [{ type: String }] })
  images: string[];

  @Prop({ type: CautionSchema, required: true })
  caution: Caution; // Reference to the Caution model.
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
