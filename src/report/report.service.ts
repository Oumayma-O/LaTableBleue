import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './models/report.model';
import { ReviewService } from '../review/review.service';
import EventEmitter2 from 'eventemitter2';
import { CreateReportDto } from './dto/create-report.dto';
import { ObjectId } from 'mongodb';
import { ReportCreatedEvent } from './reportCreated.event';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @Inject('EventEmitter2') private readonly eventEmitter: EventEmitter2, // Inject the EventEmitter2
    private reviewService: ReviewService,
  ) {}

  async findAll(): Promise<Report[]> {
    return this.reportModel.find().exec();
  }

  async findReportById(reportId: string): Promise<Report> {
    const report = await this.reportModel.findById(reportId).exec();
    if (!report) {
      throw new NotFoundException(`Report with id ${reportId} not found`);
    }
    return report;
  }

  async createReport(
    userId: ObjectId,
    reviewId: string,
    createReportDto: CreateReportDto,
  ): Promise<Report> {
    const review = await this.reviewService.findReviewById(reviewId);

    if (review.hidden) {
      throw new ForbiddenException(
        'You cannot create a report for a hidden review',
      );
    }

    const report = new this.reportModel({
      ...createReportDto,
      user: userId,
      review: reviewId,
    });
    const createdReport = await report.save();

    // Add the created report to the associated review's reports array
    await this.reviewService.addReportToReview(reviewId, createdReport._id);

    console.log('Emitting reportCreated event...');
    // Emit the ReportCreatedEvent

    this.eventEmitter.emit(
      'reportCreated',
      new ReportCreatedEvent(createdReport),
    );

    return createdReport;
  }

  async deleteReport(reportId: string): Promise<Report> {
    const report = await this.findReportById(reportId);
    const reviewId = report.review;

    const review = await this.reviewService.findReviewById(reviewId.toString());

    if (review.hidden) {
      throw new ForbiddenException(
        'You cannot delete a report for a hidden review',
      );
    }

    // Remove the report's ID from the associated review's reports array
    await this.reviewService.removeReportFromReview(reviewId, report._id);

    // Delete the report
    return await this.reportModel.findByIdAndDelete(reportId).exec();
  }

  async deleteReportsByReviewId(reviewId: string): Promise<void> {
    // Delete all reports associated with the given review ID
    await this.reportModel.deleteMany({ review: reviewId }).exec();
  }

  async findReportsByReviewId(reviewId: string): Promise<Report[]> {
    return this.reportModel.find({ review: reviewId }).exec();
  }
}
