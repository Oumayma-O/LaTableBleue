import { Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from '../../users/models/user.model';

@Schema()
export class Admin extends User {
  constructor(partial: Partial<Admin>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
