import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { RestaurantFeature, Cuisine, MealType } from './enums';
import { Caution } from './caution.model';

export type RestaurantDocument = Restaurant & Document;

@Schema()
export class Restaurant {
  @Prop({ required: true, unique: true })
  restaurantName: string;

  @Prop({ enum: Cuisine })
  cuisine: Cuisine;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true, min: 1, max: 10 })
  rating: number;

  @Prop([
    {
      category: String,
      items: [
        {
          name: String,
          price: String,
          description: String,
        },
      ],
    },
  ])
  menu: {
    category: string;
    items: { name: string; price: string; description: string }[];
  }[];

  @Prop({ type: [String] })
  menuImages: string[];

  @Prop({
    validate: function () {
      if (!this.menu && !this.menuImages) {
        throw new Error('Either menu or menuImages is required.');
      }
    },
  })
  isMenuOrMenuImagesRequired: string;

  @Prop({ type: Types.ObjectId, ref: 'Restaurateur' })
  manager: Types.ObjectId; // Use 'ObjectId' type for the reference

  @Prop()
  description: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: Caution }) // Embed Caution subdocument
  caution: Caution; // Use the name of the class as the type

  @Prop({ required: true })
  cancellationDeadline: number;

  @Prop()
  websiteLink: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  averagePrice: number;

  @Prop()
  mapsLink: string;

  @Prop()
  FbLink: string;

  @Prop()
  InstaLink: string;

  @Prop()
  foundationDate: Date;

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
            openingTime: String,
            closingTime: String,
          },
        ],
      },
    ],
  })
  operatingHours: {
    day: string;
    intervals: { openingTime: string; closingTime: string }[];
  }[];

  @Prop({ type: [String], enum: MealType })
  meals: MealType[];

  @Prop({ type: [String], enum: RestaurantFeature })
  features: RestaurantFeature[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Table' }] })
  tables: Types.ObjectId[];

  // Compute the number of tables dynamically
  get NumberOfTables(): number {
    return this.tables ? this.tables.length : 0;
  }

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Booking' }] })
  bookingHistory: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }] }) // Array of references to Review model
  reviews: Types.ObjectId[]; // Use Types.ObjectId for the array of reviews

  constructor(partial: Partial<Restaurant>) {
    Object.assign(this, partial);
  }
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
