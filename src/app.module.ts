import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TableModule } from './table/table.module';
import { AuthModule } from './auth/auth.module';
import { BlacklistModule } from './blacklist/blacklist.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { DuplicateKeyExceptionFilter } from './filters/DuplicateKeyExceptionFilter';
import { JwtPayloadGuard } from './auth/guards/jwtPayload.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { RolesGuard } from './auth/guards/Roles.guard';
import { ReportModule } from './report/report.module';
import { ConfigModule } from '@nestjs/config';
import { GuestModule } from './guest/guest.module';
import { AdminModule } from './admin/admin.module';
import { RestaurateurModule } from './restaurateur/restaurateur.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/LaTableBleue'),
    UserModule,
    ReviewModule,
    BookingModule,
    RestaurantModule,
    TableModule,
    AuthModule,
    BlacklistModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
    ReportModule,
    GuestModule,
    AdminModule,
    RestaurateurModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: DuplicateKeyExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtPayloadGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtPayloadGuard,
  ],
})
export class AppModule {}
