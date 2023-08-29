import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';
import { RestaurantModule } from './restaurant/restaurant.module';
<<<<<<< Updated upstream

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/LaTableBleue'),
    DatabaseModule,
=======
import { TableModule } from './table/table.module';
import { AuthModule } from './auth/auth.module';


import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/LaTableBleue'),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
 
>>>>>>> Stashed changes
    UserModule,
    ReviewModule,
    BookingModule,
    RestaurantModule,
<<<<<<< Updated upstream
  ],
  controllers: [AppController],
  providers: [AppService],
=======
    TableModule,
    AuthModule,

    
    AuthModule,

  ],
  controllers: [AppController],
  providers: [
    AppService,
   
  ],
>>>>>>> Stashed changes
})
export class AppModule {}
