import { Global, Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './models/booking.model';
import { BookingEventHandlers } from './booking.EventHandlers';

@Global()
@Module({
  controllers: [BookingController],
  providers: [BookingService, BookingEventHandlers],
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  exports: [BookingService],
})
export class BookingModule {}
