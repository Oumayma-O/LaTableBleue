import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './models/booking.model';
import { TableModule } from '../table/table.module';
import { UserModule } from '../users/user.module';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    TableModule,
    RestaurantModule,
  ],
})
export class BookingModule {}
