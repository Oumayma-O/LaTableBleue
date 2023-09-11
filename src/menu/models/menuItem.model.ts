import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Dish, DishSchema } from './dish.model';

@Schema()
export class MenuItem extends Document {
  @Prop({ required: true })
  category: string;

  @Prop([DishSchema])
  items: Dish[];

  constructor(partial: Partial<MenuItem>) {
    super();
    Object.assign(this, partial);
  }
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
