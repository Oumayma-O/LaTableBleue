import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReportCreatedEvent } from '../report/reportCreated.event';
import { ReviewService } from './review.service';
import { GuestDeletedEvent } from '../guest/guest.events';
import { RestaurantDeletedEvent } from '../restaurant/restaurant.events';

@Injectable()
export class ReviewEventHandlersService {
  constructor(private readonly reviewService: ReviewService) {}

  @OnEvent('reportCreated')
  async handleReportCreatedEvent(event: ReportCreatedEvent) {
    try {
      console.log('Handling reportCreated event...');

      const createdReport = event.report;

      // Fetch the associated review
      const review = await this.reviewService.findReviewById(
        createdReport.review.toString(),
      );

      // Convert process.env.HIDE_THRESHOLD to a number
      const hideThreshold = 5;

      // Check if the report count has reached the HIDE_THRESHOLD
      if (review.reportCount >= hideThreshold) {
        // Hide the review if the threshold is reached
        await this.reviewService.hideReview(review._id);
      }
    } catch (error) {
      console.error('Error handling reportCreated event:', error);
    }
  }

  @OnEvent('guestDeleted')
  async handleGuestDeleted(deletedGuest: GuestDeletedEvent) {
    // Get reviews associated with the deleted guest
    const reviewsToDelete = await this.reviewService.findReviewsByGuestId(
      deletedGuest.deletedGuest._id,
    );

    // Delete each review and its associated reports
    for (const review of reviewsToDelete) {
      await this.reviewService.deleteReviewAndAssociatedReports(review._id);
    }
  }

  @OnEvent('restaurantDeleted')
  async handleRestaurantDeleted(deletedRestaurant: RestaurantDeletedEvent) {
    const restaurantId = deletedRestaurant.deletedRestaurant._id;

    console.log(`restaurant deleted review service handler`);
    // Delete reviews associated with the deleted restaurant
    await this.reviewService.deleteReviewsByRestaurantId(restaurantId);
  }
}
