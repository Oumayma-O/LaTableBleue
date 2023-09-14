import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RestaurantDeletedEvent } from '../restaurant/restaurant.events';
import { MenuService } from './menu.service';

@Injectable()
export class MenuEventHandlersService {
  constructor(private readonly menuService: MenuService) {}

  @OnEvent('restaurantDeleted')
  async handleRestaurantDeleted(deletedRestaurant: RestaurantDeletedEvent) {
    const restaurantId = deletedRestaurant.deletedRestaurant._id;
    console.log(`restaurant deleted ${restaurantId} review service handler`);

    // Handle the deletion of menus associated with the deleted restaurant
    await this.menuService.deleteAllMenusWithRestoId(restaurantId);
  }
}
