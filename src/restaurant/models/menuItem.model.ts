import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Dish {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: string;

  @Prop()
  description: string;
}

@Schema()
export class MenuItem extends Document {
  @Prop({ required: true })
  category: string;

  @Prop([Dish])
  items: Dish[];

  constructor(partial: Partial<MenuItem>) {
    super();
    Object.assign(this, partial);
  }
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
