import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SocialLinks extends Document {
  @Prop()
  FbLink: string;

  @Prop()
  InstaLink: string;

  @Prop()
  TwitterLink: string;
}

export const SocialLinksSchema = SchemaFactory.createForClass(SocialLinks);
