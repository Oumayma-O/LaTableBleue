import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Rating {
  @Prop({ min: 1, max: 10 }) // Specify the rating range from 1 to 10.
  averageRating: number; // The rating given by the user for the restaurant.

  @Prop({ required: true, min: 1, max: 10 })
  foodRating: number;

  @Prop({ required: true, min: 1, max: 10 })
  serviceRating: number;

  @Prop({ required: true, min: 1, max: 10 })
  ambianceRating: number;

  // Constructor for initializing the review model.
  constructor(partial: Partial<Rating>) {
    Object.assign(this, partial);
  }
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
