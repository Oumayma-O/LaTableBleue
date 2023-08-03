import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CautionModule } from './caution/caution.module';
import { SearchService } from './restaurant/search.service';
import { UserService } from './user/user.service';
import { BookingService } from './booking/booking.service';
import { RestaurantService } from './restaurant/restaurant.service';
import { ReviewService } from './review/review.service';
import { CautionService } from './caution/caution.service';
import { UserController } from './user/user.controller';
import { BookingController } from './booking/booking.controller';
import { RestaurantController } from './restaurant/restaurant.controller';
import { CautionController } from './caution/caution.controller';
import { UserRepository } from './user/user.repository';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/LaTableBleue'),
    DatabaseModule,
    UserModule,
    ReviewModule,
    BookingModule,
    RestaurantModule,
    CautionModule,
  ],
  controllers: [
    AppController,
    UserController,
    BookingController,
    RestaurantController,
    RestaurantController,
    CautionController,
  ],
  providers: [
    AppService,
    SearchService,
    UserService,
    BookingService,
    RestaurantService,
    ReviewService,
    CautionService,
    UserRepository,
  ],
})
export class AppModule {}