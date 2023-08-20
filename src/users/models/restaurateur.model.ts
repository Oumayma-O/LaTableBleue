import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User, UserDocument } from './user.model';

export type RestaurateurDocument = Restaurateur & UserDocument;

@Schema()
export class Restaurateur extends User {
  @Prop({ type: 'ObjectId', ref: 'Restaurant' }) // Reference to the Restaurant model
  restaurant: string; // Use 'ObjectId' type for the reference

  constructor(partial: Partial<Restaurateur>) {
    super(partial); // Call the base class constructor
    Object.assign(this, partial);
  }
}

export const RestaurateurSchema = SchemaFactory.createForClass(Restaurateur);
