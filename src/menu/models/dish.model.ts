import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Dish extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: string;

  @Prop()
  description: string;
}

export const DishSchema = SchemaFactory.createForClass(Dish);
