import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  CreditCardDetails,
  CreditCardDetailsSchema,
} from './creditCardDetails.model';

export enum ProfileType {
  CLIENT = 'client',
  RESTAURATEUR = 'restaurateur',
  ADMIN = 'admin',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export type UserDocument = User & Document;

@Schema({ collection: 'users' })
export class User {
  @Prop({ type: Types.ObjectId, default: Types.ObjectId }) // Use Types.ObjectId for _id
  _id: Types.ObjectId; // Use Types.ObjectId for _id

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ProfileType, default: ProfileType.CLIENT })
  role: string;

  @Prop({ required: true, min: 18 })
  age: number;

  @Prop({ enum: Gender, default: Gender.OTHER }) // Gender field with enum values
  gender: string;

  @Prop({ type: CreditCardDetailsSchema, required: true }) // Use the CreditCardDetails schema
  creditCardDetails: CreditCardDetails;

  @Prop({ type: Date, default: Date.now }) // createdAt field with a default value
  createdAt: Date;

  @Prop({ required: false }) // Optional address field
  address?: string;

  @Prop({ required: false }) // Optional avatar field
  avatar?: string;

  @Prop({ type: Types.ObjectId, ref: 'Booking' }) // Array of references to the Booking model
  bookings: Types.ObjectId[]; // Use Types.ObjectId for the array of bookings

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
