import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReviewDeletedEvent } from '../review/review.events';
import { GuestService } from './guest.service';
import { ReportCreatedEvent } from "../report/reportCreated.event";

@Injectable()
export class GuestEventHandlersService {
  constructor(private readonly guestService: GuestService) {}

  @OnEvent('reviewDeleted')
  async handleReviewDeleted(deletedReview: ReviewDeletedEvent) {
    const guestId = deletedReview.deletedReview.guest;
    const reviewId = deletedReview.deletedReview._id.toString();

    await this.guestService.removeReviewFromGuest(guestId, reviewId);
  }
}
