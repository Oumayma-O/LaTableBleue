import { Global, Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './models/restaurant.model';
import { RestaurantDeletedEvent } from './restaurant.events';

@Global()
@Module({
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    RestaurantDeletedEvent, // Provide the event class
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  exports: [RestaurantService],
})
export class RestaurantModule {}
