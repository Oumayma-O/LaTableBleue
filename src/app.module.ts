import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/LaTableBleue'),
    DatabaseModule,
    UserModule,
    ReviewModule,
    BookingModule,
    RestaurantModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
