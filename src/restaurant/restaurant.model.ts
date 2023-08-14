import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Caution, CautionSchema } from './caution.model';
import { Cuisine } from "./enums/Cuisine";
import { MealType } from "./enums/MealType";
import { RestaurantFeature } from "./enums/RestaurantFeature";



export type RestaurantDocument = Restaurant & Document;

@Schema()
export class Restaurant {
  @Prop({ type: Types.ObjectId, default: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  managerFirstName: string;

  @Prop({ required: true })
  managerLastName: string;

  @Prop({ required: true, unique: true })
  managerEmail: string;


  @Prop({ required: true })
  managerPassword: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

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

  @Prop({ type: CautionSchema, required: true })
  caution: Caution;

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

  constructor(partial: Partial<Restaurant>) {
    Object.assign(this, partial);
  }
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
