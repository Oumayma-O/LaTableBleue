import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.model';
import { Review, ReviewSchema } from '../review/review.model';
import { Booking, BookingSchema } from 'src/booking/booking.model';
import { Restaurant, RestaurantSchema } from '../restaurant/restaurant.model';
import { Caution, CautionSchema } from '../restaurant/caution.model';
import { Table, TableSchema } from '../table/table.model';
import {
  CreditCardDetails,
  CreditCardDetailsSchema,
} from '../user/creditCardDetails.model';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/LaTableBleue'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Caution.name, schema: CautionSchema },
      { name: Table.name, schema: TableSchema },
      { name: CreditCardDetails.name, schema: CreditCardDetailsSchema },
    ]),
  ],
})
export class DatabaseModule {}
