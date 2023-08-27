import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Address {
  @Prop()
  AddressLine: string;

  @Prop()
  city: string;

  @Prop()
  stateProvince: string;

  @Prop()
  zipCode: number;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
