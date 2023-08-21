import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Review extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Guest' })
  guest: Types.ObjectId; // Reference to the User model (the user who wrote the review).

  @Prop({
    type: Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  })
  restaurant: Types.ObjectId; // Reference to the Restaurant model (the restaurant being reviewed).

  @Prop({ required: true, min: 1, max: 10 }) // Specify the rating range from 1 to 10.
  rating: number; // The rating given by the user for the restaurant.

  @Prop()
  comment: string; // The user's comment or review about the restaurant.

  @Prop({ type: [String] })
  images: string[]; // URL or path to an image uploaded by the user as part of the review.

  // Constructor for initializing the review model.
  constructor(partial: Partial<Review>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export const ReviewSchema = SchemaFactory.createForClass(Review);