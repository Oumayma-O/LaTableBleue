import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { BookingModule } from '../booking/booking.module';

import { Guest, GuestSchema } from './models/guest.model';

import { Restaurateur, RestaurateurSchema } from './models/restaurateur.model';
import { AdminSchema } from './models/admin.model';
import { Admin } from 'mongodb';
import { User, UserSchema } from './models/user.model';
import { ReviewModule } from '../review/review.module';
import { APP_FILTER } from '@nestjs/core';
import { DuplicateKeyExceptionFilter } from '../filters/DuplicateKeyExceptionFilter';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    {
      provide: APP_FILTER,
      useClass: DuplicateKeyExceptionFilter,
    },
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Restaurateur.name, schema: RestaurateurSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Guest.name, schema: GuestSchema },
      { name: User.name, schema: UserSchema },
    ]),
    BookingModule,
  ],
  exports: [UserService],
})
export class UserModule {}
