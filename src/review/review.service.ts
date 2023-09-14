import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './models/review.model';
import { CreateReviewDto } from './dto/createReview.dto';
import { UserService } from '../users/user.service';
import { UpdateReviewDto } from './dto/updateReview.dto';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Rating } from './models/rating.model';
import { ObjectId } from 'mongodb';
import { Report } from '../report/models/report.model';
import EventEmitter2 from 'eventemitter2';
import { ReviewDeletedEvent } from './review.events';
import { GuestService } from '../guest/guest.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<Review>,
    @Inject('EventEmitter2') private readonly eventEmitter: EventEmitter2, // Inject the EventEmitter2
    private userService: UserService,
    private guestService: GuestService,
    private restaurantService: RestaurantService,
  ) {}

  async getAllReviews(): Promise<Review[]> {
    return this.reviewModel.find().exec();
  }

  async findReviewById(reviewId: string): Promise<Review> {
    const review = await this.reviewModel.findById(reviewId).exec();
    if (!review) {
      throw new NotFoundException(`Review with id ${reviewId} not found`);
    }
    return review;
  }

  async findReviewsByRestaurantId(restaurantId: string): Promise<Review[]> {
    console.log(`restaurantId : ${restaurantId}`);
    const reviews = await this.reviewModel
      .find({ restaurant: restaurantId, hidden: false })
      .exec();
    return reviews;
  }

  async findReviewsByGuestId(guestId: string): Promise<Review[]> {
    const reviews = await this.reviewModel
      .find({ guest: guestId, hidden: false })
      .exec();
    return reviews;
  }

  async deleteReviewsByRestaurantId(restaurantId: string): Promise<void> {
    // Get reviews associated with the user
    const reviewsToDelete = await this.findReviewsByRestaurantId(restaurantId);

    console.log(`reviews ${reviewsToDelete}`);
    // Delete each review and its associated reports
    for (const review of reviewsToDelete) {
      await this.deleteReviewAndAssociatedReports(review._id);
    }
  }

  // delete related reports
  async deleteReviewAndAssociatedReports(reviewId: string): Promise<Review> {
    const deletedReview = await this.reviewModel
      .findByIdAndDelete(reviewId)
      .exec();
    if (!deletedReview) {
      throw new NotFoundException('Review not found');
    }
    console.log(`delete review event emit`);
    // Emit the reviewDeleted event
    this.eventEmitter.emit(
      'reviewDeleted',
      new ReviewDeletedEvent(deletedReview),
    );
    return deletedReview;
  }

  private calculateAverageRating(rating: Rating): number {
    const { foodRating, serviceRating, ambianceRating } = rating;
    const totalRatings = foodRating + serviceRating + ambianceRating;
    const averageRating = totalRatings / 3; // Assuming you have 3 rating categories

    return averageRating;
  }

  async CreateReview(
    userId: ObjectId,
    restaurantId: ObjectId,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    // Check if the provided restaurantId is valid
    const restaurant = await this.restaurantService.findRestaurantById(
      restaurantId,
    );
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${restaurantId} not found`,
      );
    }
    const review = new this.reviewModel({
      ...createReviewDto,
      restaurant: restaurantId,
      guest: userId,
    });
    review.rating.averageRating = this.calculateAverageRating(review.rating);
    const createdReview = await review.save();
    // Add the review ID to the restaurant's reviews array
    await this.restaurantService.addReviewToRestaurant(
      restaurant._id,
      createdReview._id,
    );
    await this.guestService.addReviewToGuest(userId, createdReview._id);
    return createdReview;
  }

  async getReviewById(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }

  async addReportToReview(reviewId: string, reportId: string): Promise<void> {
    await this.reviewModel
      .findOneAndUpdate(
        { _id: reviewId, hidden: false }, // Add condition for hidden: false
        {
          $push: { reports: reportId },
          $inc: { reportCount: 1 },
        },
      )
      .exec();
  }

  async removeReportFromReview(
    reviewId: ObjectId,
    reportId: string,
  ): Promise<void> {
    await this.reviewModel
      .findOneAndUpdate(
        { _id: reviewId, hidden: false },
        {
          $pull: { reports: reportId },
          $inc: { reportCount: -1 },
        },
      )
      .exec();
  }

  async getAllReports(userId: string, reviewId: string): Promise<Report[]> {
    const review = await this.reviewModel
      .findById(reviewId)
      .populate({
        path: 'reports',
        model: 'Report',
      })
      .exec();

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    if (review.guest.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to view reports for this review',
      );
    }

    const reports: Report[] = review.reports as unknown as Report[];
    return reports;
  }

  async updateReviewByUser(
    userId: string,
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.findReviewById(reviewId);

    if (review.guest.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this review',
      );
    }
    if (review.hidden) {
      throw new ForbiddenException(
        'This review is hidden and cannot be updated',
      );
    }
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(reviewId, updateReviewDto, { new: true })
      .exec();

    if (updateReviewDto.rating) {
      await this.restaurantService.updateAverageRating(
        updatedReview.restaurant,
      );
    }
    return updatedReview;
  }

  async deleteReviewByUser(userId: string, reviewId: string): Promise<Review> {
    const review = await this.findReviewById(reviewId);

    if (review.guest.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this review',
      );
    }
    if (review.hidden) {
      throw new ForbiddenException(
        'This review is hidden and cannot be deleted',
      );
    }
    return await this.deleteReviewAndAssociatedReports(reviewId);
  }

  async hideReview(reviewId: string): Promise<void> {
    const review = await this.findReviewById(reviewId);
    review.hidden = true;
    await review.save();
  }

  async getHiddenReviews(): Promise<Review[]> {
    return this.reviewModel.find({ hidden: true }).exec();
  }
}
