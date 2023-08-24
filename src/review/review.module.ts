import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './review.model';
import {RestaurantModule} from "../restaurant/restaurant.module";
import {UserModule} from "../users/user.module";
import {RestaurantService} from "../restaurant/restaurant.service";
import {UserService} from "../users/user.service";
import {Restaurant, RestaurantSchema} from "../restaurant/models/restaurant.model";
import {Guest, GuestSchema} from "../users/models/guest.model";
import {TableModule} from "../table/table.module";
import {TableService} from "../table/table.service";
import {Admin, AdminSchema} from "../users/models/admin.model";
import {Restaurateur, RestaurateurSchema} from "../users/models/restaurateur.model";
import {Table, TableSchema} from "../table/table.model";

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, RestaurantService,UserService,TableService],
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Guest.name, schema: GuestSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Restaurateur.name, schema: RestaurateurSchema },
      { name: Table.name, schema: TableSchema }
    ]),
    RestaurantModule,
    UserModule, TableModule
  ],
})
export class ReviewModule {}
