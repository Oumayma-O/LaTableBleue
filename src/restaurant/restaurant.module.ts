import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './models/restaurant.model';
import { TableModule } from '../table/table.module';
import { RestaurantRepository } from './restaurant.repository';
import { ReviewModule } from '../review/review.module';

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService, RestaurantRepository],
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    TableModule,
    ReviewModule,
  ],
})
export class RestaurantModule {}
