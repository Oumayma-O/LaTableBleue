import { Restaurant } from './models/restaurant.model';

export class RestaurantDeletedEvent {
  constructor(public readonly deletedRestaurant: Restaurant) {}
}
