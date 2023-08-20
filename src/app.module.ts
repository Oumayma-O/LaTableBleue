import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TableModule } from './table/table.module';
import { AuthModule } from './auth/auth.module';
import { ClientDashboardModule } from './client-dashboard/client-dashboard.module';
import { RestaurateurDashboardModule } from './restaurateur-dashboard/restaurateur-dashboard.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/LaTableBleue'),
    DatabaseModule,
    UserModule,
    ReviewModule,
    BookingModule,
    RestaurantModule,
    TableModule,
    AuthModule,
    ClientDashboardModule,
    RestaurateurDashboardModule,
    AdminDashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
