import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TableDescription {
  CORNER = 'Corner',
  MIDDLE = 'Middle',
  SEAVIEW = 'Sea View',
  WINDOW_SIDE = 'Window Side',
  BOOTH = 'Booth',
  HIGH_TOP = 'High Top',
  OUTDOOR = 'Outdoor',
  PRIVATE_ROOM = 'Private Room',
  BAR_COUNTER = 'Bar Counter',
  COUCH = 'Couch',
  OTHER = 'Other',
}

@Schema()
export class Table {
  @Prop({ required: true, unique: true })
  number: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ enum: Object.values(TableDescription) })
  description: TableDescription;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant' })
  restaurant: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Booking' }] })
  bookings: Types.ObjectId[];

  constructor(partial: Partial<Table>) {
    Object.assign(this, partial);
  }
}

export type TableDocument = Table & Document;
export const TableSchema = SchemaFactory.createForClass(Table);