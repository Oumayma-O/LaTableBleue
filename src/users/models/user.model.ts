import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })


export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: false })
 
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Date, default: Date.now }) // createdAt field with a default value
  createdAt: Date;

  @Prop({ type: Date, default: null }) // Soft delete timestamp
  deletedAt?: Date;

  @Prop({ required: false }) // Optional avatar field
  avatar?: string;

 
}

export const UserSchema = SchemaFactory.createForClass(User);
