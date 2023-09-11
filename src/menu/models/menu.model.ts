import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { MenuItem, MenuItemSchema } from './menuItem.model';

@Schema()
export class Menu extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [MenuItemSchema], default: [] }) // Embed MenuItemSchema within the menu
  menuItems: MenuItem[];

  @Prop({ type: 'ObjectId', ref: 'Restaurant' }) // Reference to the Restaurant model
  restaurant: ObjectId; // Use 'ObjectId' type for the reference

  @Prop({ type: Date, default: Date.now }) // createdAt field with a default value
  createdAt: Date;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
