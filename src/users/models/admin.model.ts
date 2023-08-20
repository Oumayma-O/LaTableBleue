import { Schema, SchemaFactory } from '@nestjs/mongoose';

import { User, UserDocument } from './user.model';

export type AdminDocument = Admin & UserDocument;

@Schema()
export class Admin extends User {
  constructor(partial: Partial<Admin>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
