import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

@Schema({ collection: 'users' })
export class User extends Document {
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

  @Prop({ enum: Gender, default: Gender.OTHER }) // Gender field with enum values
  gender: string;

  @Prop({ type: Date, default: Date.now }) // createdAt field with a default value
  createdAt: Date;

  @Prop({ type: Date, default: null }) // Soft delete timestamp
  deletedAt?: Date;

  @Prop({ required: false }) // Optional avatar field
  avatar?: string;

  constructor(partial: Partial<User>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
