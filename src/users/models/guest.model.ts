import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  CreditCardDetails,
  CreditCardDetailsSchema,
} from './creditCardDetails.model';
import { User } from './user.model';

@Schema()
export class Guest extends User {
  @Prop({ required: false, type: Date })
  birthdate?: Date;

  // Getter for computed age
  get age(): number | undefined {
    if (!this.birthdate) return undefined;

    const currentDate = new Date();
    const birthdate = new Date(this.birthdate);
    const age = currentDate.getFullYear() - birthdate.getFullYear();

    // Adjust age if birthdate hasn't occurred yet this year
    if (
      currentDate.getMonth() < birthdate.getMonth() ||
      (currentDate.getMonth() === birthdate.getMonth() &&
        currentDate.getDate() < birthdate.getDate())
    ) {
      return age - 1;
    }

    return age;
  }

  @Prop({ type: CreditCardDetailsSchema, required: false }) // Use the CreditCardDetails schema
  creditCardDetails?: CreditCardDetails;

  @Prop({ required: false }) // Optional address field
  address?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Booking' }] }) // Array of references to the Booking model
  bookings?: Types.ObjectId[]; // Use Types.ObjectId for the array of bookings

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }] }) // Array of references to Review model
  reviews?: Types.ObjectId[]; // Use Types.ObjectId for the array of reviews

  constructor(partial: Partial<Guest>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export const GuestSchema = SchemaFactory.createForClass(Guest);
