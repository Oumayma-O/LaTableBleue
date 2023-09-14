import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TableDeletedEvent } from '../table/table.events';
import { ReviewDeletedEvent } from '../review/review.events';
import { RestaurantService } from './restaurant.service';

@Injectable()
export class RestaurantEventHandlers {
  constructor(private readonly restaurantService: RestaurantService) {}

  @OnEvent('tableDeleted')
  async handleTableDeleted(deletedTable: TableDeletedEvent) {
    const restaurantId = deletedTable.deletedTable.restaurant; // Assuming this is how the relationship is stored
    const tableId = deletedTable.deletedTable._id;

    await this.restaurantService.removeTableFromRestaurant(
      restaurantId,
      tableId,
    );
  }

  @OnEvent('reviewDeleted')
  async handleReviewDeleted(deletedReview: ReviewDeletedEvent) {
    const restaurantId = deletedReview.deletedReview.restaurant; // Assuming this is how the relationship is stored
    const reviewId = deletedReview.deletedReview._id;

    await this.restaurantService.removeReviewFromRestaurant(
      restaurantId,
      reviewId,
    );
  }
}
