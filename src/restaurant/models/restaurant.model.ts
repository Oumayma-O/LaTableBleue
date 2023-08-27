import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  RestaurantFeature,
  Cuisine,
  MealType,
  RestaurantStatus,
} from './enums';
import { Caution } from './caution.model';
import { Address, AddressSchema } from './address.model';
import { MenuItem, MenuItemSchema } from './menuItem.model';
import { SocialLinks, SocialLinksSchema } from './socialLinks.model';
import {
  OperatingHoursPerDay,
  OperatingHoursPerDaySchema,
} from './operatingHoursPerDay.model';

@Schema()
export class Restaurant extends Document {
  @Prop({ required: true, unique: true })
  restaurantName: string;

  @Prop({ enum: Cuisine })
  cuisine: Cuisine;

  @Prop({ required: false, min: 1, max: 10 })
  rating?: number;

  @Prop({ type: Types.ObjectId, ref: 'Restaurateur' })
  manager: Types.ObjectId; // Use 'ObjectId' type for the reference

  @Prop({ required: true })
  cancellationDeadline: number;

  @Prop({ type: OperatingHoursPerDaySchema }) // Array of operating hours
  operatingHours: OperatingHoursPerDay[];

  @Prop([MenuItemSchema]) // Array of menu items
  menu: MenuItem[];

  @Prop({ type: Types.ObjectId, ref: 'Table' }) // Array of references to Table model
  tables?: Types.ObjectId[];

  @Prop({ required: true })
  tableNumber: number;

  @Prop({ type: Types.ObjectId, ref: 'Booking' }) // Array of references to Booking model
  bookingHistory?: Types.ObjectId[];

  @Prop({ type: [String], enum: MealType })
  meals: MealType[];

  @Prop({ type: [String], enum: RestaurantFeature })
  features: RestaurantFeature[];

  @Prop({ type: [String] }) // Array of restaurant images
  restaurantImages: string[];

  @Prop({ type: Caution }) // Embed Caution subdocument
  caution: Caution; // Use the name of the class as the type

  @Prop({ type: AddressSchema, required: true })
  address: Address;

  @Prop({ required: true })
  RestaurantPhoneNumber: string;

  @Prop({ required: true })
  averagePrice: number;

  @Prop({ required: true }) // Description
  description: string;

  @Prop({ type: SocialLinksSchema }) // Embed SocialLinks subdocument
  socialLinks: SocialLinks;

  @Prop() // Website link
  websiteLink: string;

  @Prop() // Foundation date
  foundationDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }] }) // Array of references to Review model
  reviews?: Types.ObjectId[]; // Use Types.ObjectId for the array of reviews

  @Prop({ default: RestaurantStatus.PENDING, enum: RestaurantStatus }) // Status: 'pending', 'approved', 'rejected', etc.
  status: string;

  @Prop({ type: Date }) // Timestamp when approved
  approvalTimestamp?: Date;

  @Prop({ type: Date }) // Timestamp when rejected
  RejectionTimestamp?: Date;

  constructor(partial: Partial<Restaurant>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
