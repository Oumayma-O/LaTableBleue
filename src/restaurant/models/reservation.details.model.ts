import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ReservationDetails {
  @Prop({ required: true })
  reservationDuration: number; // Duration of a reservation in minutes

  @Prop({ required: true })
  preparationTime: number; // Time needed to prepare a table for the next reservation in minutes

  @Prop({ required: true })
  bookingBufferTime: number; // Buffer time between reservations in minutes

  constructor(partial: Partial<ReservationDetails>) {
    Object.assign(this, partial);
  }
}

export const ReservationDetailsSchema =
  SchemaFactory.createForClass(ReservationDetails);
