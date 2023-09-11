import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  PaymentMethodDetails,
  PaymentMethodDetailsSchema,
} from './PaymentMethodDetails.model';
import { User } from '../../users/models/user.model';
import { Address, AddressSchema } from '../../restaurant/models/address.model';
import { Booking } from '../../booking/models/booking.model';
import { Review } from '../../review/models/review.model';

@Schema()
export class Guest extends User {
  @Prop({ required: false })
  ReviewDisplayName?: string;

  @Prop({ required: false, type: Date })
  birthdate?: Date;

  @Prop([{ type: PaymentMethodDetailsSchema }]) // Array of payment methods
  paymentMethods?: PaymentMethodDetails[];

  @Prop({ type: AddressSchema, required: false })
  address?: Address;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Booking' }] }) // Array of references to the Booking model
  bookings?: Types.ObjectId[]; // Use Types.ObjectId for the array of bookings

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }] }) // Array of references to Review model
  reviews?: Types.ObjectId[]; // Use Types.ObjectId for the array of reviews

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Restaurant' }] })
  savedRestaurants?: Types.ObjectId[];

  constructor(partial: Partial<Guest>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export const GuestSchema = SchemaFactory.createForClass(Guest);
