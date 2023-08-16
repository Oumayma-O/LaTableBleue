import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Restaurant } from '../restaurant/models/restaurant.model'; // Import Restaurant model
import { BookingState } from './enums';
import { Table } from '../table/table.model';
import { User } from '../users/models/user.model'; // Import BookingState enum

export class Booking {
  @prop({ ref: User })
  user: Ref<User>;

  @prop({ ref: Restaurant, required: true })
  restaurant: Ref<Restaurant>;

  @prop({ required: true })
  dateTime: Date;

  @prop({ required: true })
  numberOfPersons: number;

  @prop({ default: 0 })
  cautionAmount: number;

  @prop({ enum: BookingState, default: BookingState.PENDING })
  bookingState: BookingState;

  @prop([
    {
      state: { type: String, enum: BookingState },
      timestamp: Date,
    },
  ])
  stateChanges: { state: BookingState; timestamp: Date }[];

  @prop({ default: Date.now() })
  createdAt: Date;

  @prop({ ref: 'Table' }) // Use the class name instead of string
  bookedTables: Ref<Table>[];

  @prop()
  cancellationDeadline: Date;

  @prop()
  paymentDelay: Date;

  constructor(partial: Partial<Booking>) {
    Object.assign(this, partial);
  }
}

export const BookingModel = getModelForClass(Booking);
