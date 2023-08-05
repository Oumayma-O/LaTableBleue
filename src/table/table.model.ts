import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TableStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
}

export enum TableDescription {
  CORNER = 'corner',
  MIDDLE = 'middle',
  SEAVIEW = 'seaView',
  // Add other table descriptions as needed
}

@Schema()
export class Table {
  @Prop({ required: true, unique: true })
  number: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ enum: Object.values(TableStatus), default: TableStatus.AVAILABLE })
  status: TableStatus;

  @Prop({ enum: Object.values(TableDescription) })
  description: TableDescription;

  constructor(partial: Partial<Table>) {
    Object.assign(this, partial);
  }
}

export type TableDocument = Table & Document;
export const TableSchema = SchemaFactory.createForClass(Table);
