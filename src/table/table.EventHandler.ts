import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RestaurantDeletedEvent } from '../restaurant/restaurant.events';
import { TableService } from './table.service';

@Injectable()
export class TableEventHandlersService {
  constructor(private readonly tableService: TableService) {}

  @OnEvent('restaurantDeleted')
  async handleRestaurantDeleted(deletedRestaurant: RestaurantDeletedEvent) {
    console.log(`Restaurant deleted table service handler`);

    // Delete tables associated with the deleted restaurant
    await this.tableService.deleteTablesByRestaurantId(
      deletedRestaurant.deletedRestaurant._id,
    );
  }
}
