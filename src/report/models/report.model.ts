import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Report extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true })
  reason: string;

  @Prop({ type: Types.ObjectId, ref: 'Review' })
  review: Types.ObjectId;

  @Prop({ type: Date, default: Date.now }) // createdAt field with a default value
  createdAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
