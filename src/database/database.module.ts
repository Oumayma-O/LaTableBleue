import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.model';
import { Review, ReviewSchema } from '../review/review.model';
import { Booking, BookingSchema } from 'src/booking/booking.model';
import { Restaurant, RestaurantSchema } from '../restaurant/restaurant.model';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/LaTableBleue'), // Replace with your actual MongoDB connection URL.
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
})
export class DatabaseModule {}
