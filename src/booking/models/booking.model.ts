import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BookingState } from './enums';

@Schema()
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Guest' })
  guest: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant' })
  restaurant: Types.ObjectId;

  @Prop({ required: true })
  dateTime: Date;

  @Prop({ required: true })
  partySize: number;

  @Prop({ default: 0 })
  cautionAmount: number;

  @Prop()
  specialRequest?: string;

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

  @Prop({ default: false })
  cautionPayed: boolean;

  @Prop({ default: false })
  reservationComplete: boolean;

  constructor(partial: Partial<Booking>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
