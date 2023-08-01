import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './models/restaurant.model';
import { Caution, CautionSchema } from './models/caution.model';
import { User, UserSchema } from './models/user.model';
import { Review, ReviewSchema } from './models/review.model';
import { Wallet, WalletSchema } from './models/wallet.model';
import { Booking, BookingSchema } from './models/booking.model';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mydatabase'), // Replace with your actual MongoDB connection URL.
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Caution.name, schema: CautionSchema },

    ]),
  ],
})
export class DatabaseModule {}
