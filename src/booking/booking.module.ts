import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './booking.model';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
})
export class BookingModule {}