import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum BookingState {
  WAITING = 'waiting',
  APPROVED = 'approved',
  DISAPPROVED = 'disapproved',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ type: Types.ObjectId, default: Types.ObjectId }) // Use Types.ObjectId for _id
  _id: Types.ObjectId; // Use Types.ObjectId for _id

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId; // Reference to the User model (the user who made the booking).

  @Prop({
    type: Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  })
  restaurant: Types.ObjectId; // Reference to the Restaurant model (the restaurant being booked).

  @Prop({ required: true })
  dateTime: Date; // The date and time of the booking.

  @Prop({ required: true })
  numberOfPersons: number; // The number of persons for the booking.

  @Prop({ default: 0 })
  cautionAmount: number; // The caution amount paid by the user for this booking.

  @Prop({ enum: Object.values(BookingState), default: BookingState.WAITING })
  bookingState: BookingState; // The state of the booking (waiting, approved, disapproved, cancelled, completed).

  @Prop({ default: Date.now() })
  createdAt: Date; // The date and time the booking was created at.

  // Constructor for initializing the booking model.
  constructor(partial: Partial<Booking>) {
    Object.assign(this, partial);
  }
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
