import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReviewDeletedEvent } from '../review/review.events';
import { ReportService } from './report.service';

@Injectable()
export class ReportEventHandlersService {
  constructor(private readonly reportService: ReportService) {}

  @OnEvent('reviewDeleted')
  async handleReviewDeleted(deletedReview: ReviewDeletedEvent) {
    console.log(`review deleted report service handler`);
    const reviewId = deletedReview.deletedReview._id;

    // Handle the deletion of reports associated with the deleted review
    await this.reportService.deleteReportsByReviewId(reviewId.toString());
  }
}
