import { Global, Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './models/restaurant.model';
import { EventEmitter2 } from 'eventemitter2';
import { RestaurantDeletedEvent } from './restaurant..events';

@Global()
@Module({
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    {
      provide: 'EventEmitter2', // Provide the EventEmitter2 token
      useValue: new EventEmitter2(), // Create a new instance of EventEmitter2
    },
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
