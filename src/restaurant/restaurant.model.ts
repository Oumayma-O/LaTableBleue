import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Caution, CautionSchema } from './caution.model';

export enum Cuisine {
  TUNISIAN = 'Tunisian',
  LEBANESE = 'Lebanese',
  MIDDLE_EAST = 'Middle Eastern',
  INDIAN = 'Indian',
  TURKISH = 'Turkish',
  ITALIAN = 'Italian',
  FRENCH = 'French',
  SYRIAN = 'Syrian',
  JAPANESE = 'Japanese',
  TAIWANESE = 'Taiwanese',
  CHINESE = 'Chinese',
  MEXICAN = 'mexican',
  VEGETARIAN = 'Vegetarian',
  FUSION = 'Fusion',
  KOREAN = 'Korean',
  ASIAN = 'Asian', // Can represent a broader category for various Asian cuisines.
}

export enum MealType {
  BREAKFAST = 'Breakfast',
  BRUNCH = 'Brunch',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  LATE_DINNER = 'Late Dinner',
  COCKTAIL = 'Cocktail',
  SNACK = 'Snack',
  DESSERT = 'Dessert',
  BEVERAGE = 'Beverage',
  BREAKING_FAST = 'Breaking fast',
  OTHER = 'Other',
}

export enum RestaurantFeature {
  WITH_FRIENDS = 'With friends',
  DINNER_AND_SHOW = ' Dinner and Show ',
  ALL_YOU_CAN_EAT_BUFFET = 'All You Can Eat Buffet',
  BIRTHDAY = 'Birthday',
  BISTRO = 'Bistro',
  BISTRONOMIC = 'Bistronomic',
  CONTEMPORARY_CUISINE = 'Contemporary Cuisine',
  FINE_DINING = 'Fine Dining',
  FROM_MARKET = 'From Market',
  GARDEN = 'Garden',
  GIFT_CARDS = 'Gift Cards',
  GOOD_FOR_BUSINESS_LUNCH = 'Good for a Business Lunch',
  GOOD_FOR_FAMILIES = 'Good for Families',
  GOOD_FOR_GROUPS = 'Good for Groups',
  GREAT_VIEW = 'Great View',
  IN_THE_MOUNTAINS = 'In the Mountains',
  KID_FRIENDLY = 'Kid-Friendly',
  SEAFRONT = 'Seafront',
  ORGANIC = 'Organic',
  RESTAURANT_HOTEL = 'Restaurant Hotel',
  ROMANTIC = 'Romantic',
  SEMINAR = 'Seminar',
  TERRACE = 'Terrace',
  TRADITIONAL = 'Traditional',
  TRENDY = 'Trendy',
  WEDDING = 'Wedding',
  WINE_BAR = 'Wine Bar',
}

export type RestaurantDocument = Restaurant & Document;

@Schema()
export class Restaurant {
  @Prop({ type: Types.ObjectId, default: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true, enum: Object.values(Cuisine) })
  cuisine: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true, min: 1, max: 10 })
  rating: number;

  @Prop([
    {
      category: { type: String, required: true }, // Menu category (e.g., Entrantes, Ensaladas, Arroces, etc.)
      items: [
        {
          name: { type: String, required: true }, // Menu item name (e.g., Pulpo a la parrilla con chimichurri)
          price: { type: String, required: true }, // Price of the menu item (e.g., €29)
          description: { type: String, required: true }, // Description of the menu item
        },
      ],
    },
  ])
  menu: {
    category: string;
    items: { name: string; price: string; description: string }[];
  }[];

  @Prop({ type: [{ type: String }] })
  menuImages: string[];

  @Prop({
    validate: function () {
      if (!this.menu && !this.menuImages) {
        throw new Error('Either menu or menuImages is required.');
      }
    },
  })
  isMenuOrMenuImagesRequired: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ type: [{ type: String }] })
  images: string[];

  @Prop({ type: CautionSchema, required: true })
  caution: Caution;

  @Prop({ required: true })
  cancellationDeadline: number;

  @Prop({ type: String })
  websiteLink: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: Number })
  averagePrice: number;

  @Prop({ type: String })
  mapsLink: string;

  @Prop({ type: String })
  FbLink: string;

  @Prop({ type: String })
  InstaLink: string;

  @Prop({ type: Date })
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
            openingTime: { type: String },
            closingTime: { type: String },
          },
        ],
      },
    ],
  })
  operatingHours: {
    day: string;
    intervals: { openingTime: string; closingTime: string }[];
  }[];

  @Prop({ type: [{ type: String, enum: Object.values(MealType) }] })
  meals: string[];

  @Prop({ type: [{ type: String, enum: Object.values(RestaurantFeature) }] })
  features: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Table' }] })
  tables: Types.ObjectId[]; // Array of references to Table model.

  @Prop({ type: Number })
  NumberOfTables: number;

  constructor(partial: Partial<Restaurant>) {
    Object.assign(this, partial);
  }
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
