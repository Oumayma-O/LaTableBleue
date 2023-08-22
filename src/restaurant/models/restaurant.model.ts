import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {Cuisine, MealType, RestaurantFeature} from "./enums";



export type RestaurantDocument = Restaurant & Document;

@Schema()
export class Restaurant {


  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true, enum: Object.values(Cuisine) })
  cuisine: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop([
    {
      category: { type: String }, // Menu category (e.g., Entrantes, Ensaladas, Arroces, etc.)
      items: [
        {
          name: { type: String }, // Menu item name (e.g., Pulpo a la parrilla con chimichurri)
          price: { type: String }, // Price of the menu item (e.g., €29)
          description: { type: String }, // Description of the menu item
        },
      ],
    },
  ])
  menu?: {
    category: string;
    items: { name: string; price: string; description: string }[];
  }[];


  @Prop({required: true})
  description: string;

  @Prop({ type: [{ type: String }] })
  images?: string[];

  @Prop({
    required: true,
    type: {
      fixedAmount: { type: Number, required: true },
      weekendMultiplier: { type: Number, default: 1.2 },
      specialOccasionMultiplier: { type: Number, default: 1.5 },
      partySizeMultiplier: { type: Number, default: 1.1 },
    },
  })
  caution: {
    fixedAmount: number;
    weekendMultiplier?: number;
    specialOccasionMultiplier?: number;
    partySizeMultiplier?: number;
  };


  @Prop({ required: true })
  CancellationDeadline: number;

  @Prop({ type: String })
  website?: string;


  @Prop({ type: Number })
  averagePrice?: number;

  @Prop({ type: String })
  mapsLink?: string;

  @Prop({ type: Date })
  foundationDate?: Date;

  @Prop({
    type: [
      {
        day: {
          type: String,
          enum: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
        },
        intervals: [
          {
            openingTime: { type: String },
            closingTime: { type: String },
          },
        ],
      },
    ],
  })
  operatingHours?: {
    day: string;
    intervals: { openingTime: string; closingTime: string }[];
  }[];

  @Prop({ type: [{ type: String, enum: Object.values(MealType) }] })
  meals?: string[];

  @Prop({ type: [{ type: String, enum: Object.values(RestaurantFeature) }] })
  features?: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Table' }] })
  tables: Types.ObjectId[]; // Array of references to Table documents


  constructor(partial: Partial<Restaurant>) {
    Object.assign(this, partial);
  }
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);