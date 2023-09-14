import { Global, Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './models/restaurant.model';
import { RestaurantDeletedEvent } from './restaurant.events';
import { RestaurantEventHandlers } from './restaurant.EventHandler';

@Global()
@Module({
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    RestaurantDeletedEvent,
    RestaurantEventHandlers,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  exports: [RestaurantService, RestaurantEventHandlers],
})
export class RestaurantModule {}
