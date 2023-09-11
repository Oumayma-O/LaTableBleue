import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BlacklistToken extends Document {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expireAt: Date;
}

export const BlacklistTokenSchema =
  SchemaFactory.createForClass(BlacklistToken);
