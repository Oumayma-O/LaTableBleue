import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './models/report.model';
import { ReviewService } from '../review/review.service';
import EventEmitter2 from 'eventemitter2';
import { ReviewDeletedEvent } from '../review/review.events';
import { Review } from '../review/models/review.model';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @Inject('EventEmitter2') private readonly eventEmitter: EventEmitter2,
    private readonly reviewService: ReviewService,
  ) {
    // Listen for the reviewDeleted event
    this.eventEmitter.on('reviewDeleted', (event: ReviewDeletedEvent) => {
      this.handleReviewDeleted(event.deletedReview);
    });
  }

  async createReport(reviewId: string, reason: string): Promise<Report> {
    const report = new this.reportModel({ review: reviewId, reason });
    const createdReport = await report.save();

    // Add the created report to the associated review's reports array
    await this.reviewService.addReportToReview(reviewId, createdReport._id);

    return createdReport;
  }

  async findAll(): Promise<Report[]> {
    return this.reportModel.find().exec();
  }

  async removeReport(reportId: string): Promise<void> {
    // Find the report and its associated review
    const report = await this.reportModel.findById(reportId).exec();
    if (!report) {
      return;
    }
    const reviewId = report.review;

    // Remove the report's ID from the associated review's reports array
    await this.reviewService.removeReportFromReview(reviewId, report._id);

    // Delete the report
    await this.reportModel.findByIdAndDelete(reportId).exec();
  }

  async handleReviewDeleted(deletedReview: Review) {
    const reviewId = deletedReview._id;

    // Delete reports associated with the deleted review
    await this.deleteReportsByReviewId(reviewId);
  }

  async deleteReportsByReviewId(reviewId: string): Promise<void> {
    // Delete all reports associated with the given review ID
    await this.reportModel.deleteMany({ review: reviewId }).exec();
  }

  async findReportsByReviewId(reviewId: string): Promise<Report[]> {
    return this.reportModel.find({ review: reviewId }).exec();
  }
}
