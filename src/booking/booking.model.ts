import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Restaurant } from '../restaurant/restaurant.model';

export enum BookingState {
  PENDING = 'pending', // The booking is pending approval or confirmation.
  APPROVED = 'approved', // The booking has been approved by the restaurateur.
  DISAPPROVED = 'disapproved', // The booking has been disapproved by the restaurateur.
  CANCELLED = 'cancelled', // The booking has been cancelled by the client or restaurateur.
  CONFIRMED = 'confirmed', // The booking has been confirmed after the caution payment.
  COMPLETED = 'completed', // The client shows up at the booked time, and the booking is completed.
  MISSED = 'missed', // The client doesn't show up at the booked time.
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

  @Prop({ enum: Object.values(BookingState), default: BookingState.PENDING })
  bookingState: BookingState; // The state of the booking (waiting, approved, disapproved, cancelled, completed,failed).

  @Prop([
    {
      state: { type: String, enum: Object.values(BookingState) },
      timestamp: { type: Date },
    },
  ])
  stateChanges: { state: BookingState; timestamp: Date }[]; // Array of state change objects

  @Prop({ default: Date.now() })
  createdAt: Date; // The date and time the booking was created at.

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Table' }] })
  bookedTables: Types.ObjectId[]; // Array of references to Table model.

  @Prop({ type: Date }) // The cancellation deadline is calculated as (reservation date - restaurant.cancellationDeadline)
  cancellationDeadline: Date;

  @Prop({ type: Date }) // The payment delay is calculated as (reservation creation date + caution.PaymentDelay)
  paymentDelay: Date;

  // Constructor for initializing the booking model.
  constructor(partial: Partial<Booking>) {
    Object.assign(this, partial);
  }
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
