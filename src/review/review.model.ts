import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema()
export class Review {
  @Prop({ type: Types.ObjectId, default: Types.ObjectId }) // Use Types.ObjectId for _id
  _id: Types.ObjectId; // Use Types.ObjectId for _id

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string; // Reference to the User model (the user who wrote the review).

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  })
  restaurant: string; // Reference to the Restaurant model (the restaurant being reviewed).

  @Prop({ required: true, min: 1, max: 10 }) // Specify the rating range from 1 to 10.
  rating: number; // The rating given by the user for the restaurant.

  @Prop()
  comment: string; // The user's comment or review about the restaurant.

  @Prop()
  image: string; // URL or path to an image uploaded by the user as part of the review.

  // Constructor for initializing the review model.
  constructor(partial: Partial<Review>) {
    Object.assign(this, partial);
  }
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
