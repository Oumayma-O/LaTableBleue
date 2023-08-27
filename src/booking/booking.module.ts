import { Global, Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './models/booking.model';
import { EventEmitter2 } from "eventemitter2";

@Global()
@Module({
  controllers: [BookingController],
  providers: [
    BookingService,
    {
      provide: 'EventEmitter2', // Provide the EventEmitter2 token
      useValue: new EventEmitter2(), // Create a new instance of EventEmitter2
    },],
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  exports: [BookingService],
})
export class BookingModule {}
