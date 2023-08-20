import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { BookingState } from './enums';

@Schema()
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'Guest' })
  guest: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: mongoose.Types.ObjectId;

  @Prop({ required: true })
  dateTime: Date;

  @Prop({ required: true })
  numberOfPersons: number;

  @Prop({ default: 0 })
  cautionAmount: number;

  @Prop({ enum: BookingState, default: BookingState.PENDING })
  bookingState: BookingState;

  @Prop([
    {
      state: { type: String, enum: Object.values(BookingState) },
      timestamp: Date,
    },
  ])
  stateChanges: { state: BookingState; timestamp: Date }[];

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Table' }] }) // Array of references to Table model.
  bookedTables: Types.ObjectId[];

  @Prop({ type: Date })
  cancellationDeadline: Date;

  @Prop({ type: Date })
  paymentDelay: Date;
}

export type BookingDocument = Booking & Document;
export const BookingSchema = SchemaFactory.createForClass(Booking);
