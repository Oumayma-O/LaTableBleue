import {
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
import { GuestDeletedEvent } from '../guest/guest.events';
import EventEmitter2 from 'eventemitter2';
import { Guest } from '../guest/models/guest.model';
import { ReviewDeletedEvent } from './review.events';
import { RestaurantDeletedEvent } from '../restaurant/restaurant.events';
import { Restaurant } from '../restaurant/models/restaurant.model';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<Review>,
    @Inject('EventEmitter2') private readonly eventEmitter: EventEmitter2, // Inject the EventEmitter2
    private userService: UserService,
    private restaurantService: RestaurantService,
  ) {
    // Listen for the guestDeleted event
    this.eventEmitter.on('guestDeleted', (event: GuestDeletedEvent) => {
      this.handleGuestDeleted(event.deletedGuest);
    });
    // Listen for the restaurantDeleted event
    this.eventEmitter.on(
      'restaurantDeleted',
      (event: RestaurantDeletedEvent) => {
        this.handleRestaurantDeleted(event.deletedRestaurant);
      },
    );
  }

  async findReviewById(reviewId: string): Promise<Review> {
    const review = await this.reviewModel.findById(reviewId).exec();
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async findReviewsByRestaurantId(restaurantId: string): Promise<Review[]> {
    const reviews = await this.reviewModel
      .find({ restaurant: restaurantId })
      .exec();
    return reviews;
  }

  async findReviewsByGuestId(guestId: string): Promise<Review[]> {
    const reviews = await this.reviewModel.find({ guest: guestId }).exec();
    return reviews;
  }

  async handleGuestDeleted(deletedGuest: Guest) {
    // Get reviews associated with the deleted guest
    const reviewsToDelete = await this.findReviewsByGuestId(deletedGuest._id);

    // Delete each review and its associated reports
    for (const review of reviewsToDelete) {
      await this.deleteReviewAndAssociatedReports(review._id);
    }
  }

  async handleRestaurantDeleted(deletedRestaurant: Restaurant) {
    const restaurantId = deletedRestaurant._id;

    // Delete reviews associated with the deleted restaurant
    await this.deleteReviewsByRestaurantId(restaurantId);
  }

  async deleteReviewsByRestaurantId(restaurantId: string): Promise<void> {
    // Get reviews associated with the user
    const reviewsToDelete = await this.findReviewsByRestaurantId(restaurantId);

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
    // Emit the reviewDeleted event
    this.eventEmitter.emit(
      'reviewDeleted',
      new ReviewDeletedEvent(deletedReview),
    );
    return deletedReview;
  }

  private calculateAverageRating(rating: Rating): number {
    const { foodRating, serviceRating, ambienceRating } = rating;
    const totalRatings = foodRating + serviceRating + ambienceRating;
    const averageRating = totalRatings / 3; // Assuming you have 3 rating categories

    return averageRating;
  }

  async CreateReview(
    userId: ObjectId,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const restaurantId = createReviewDto.restaurant;
    // Check if the provided restaurantId is valid
    const restaurant = await this.restaurantService.findRestaurantById(
      restaurantId,
    );
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${restaurantId} not found`,
      );
    }
    const review = new this.reviewModel(createReviewDto);
    review.guest = userId;
    review.rating.averageRating = this.calculateAverageRating(review.rating);

    // Add the review ID to the restaurant's reviews array
    await this.restaurantService.addReviewToRestaurant(
      createReviewDto.restaurant,
      review._id,
    );
    await this.userService.guestService.addReviewToGuest(userId, review._id);
    return review;
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
      .findByIdAndUpdate(reviewId, {
        $push: { reports: reportId },
        $inc: { reportCount: 1 },
      })
      .exec();
  }

  async removeReportFromReview(
    reviewId: ObjectId,
    reportId: string,
  ): Promise<void> {
    await this.reviewModel
      .findByIdAndUpdate(reviewId, {
        $pull: { reports: reportId },
        $inc: { reportCount: -1 },
      })
      .exec();
  }

  async getAllReports(reviewId: string): Promise<Report[]> {
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

    const reports: Report[] = review.reports as unknown as Report[];
    return reports;
  }

  async updateReview(
    userId: string,
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.findReviewById(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with id ${reviewId} not found`);
    }
    if (review.guest.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this review',
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

  async deleteUserReview(userId: string, reviewId: string): Promise<Review> {
    const review = await this.findReviewById(reviewId);

    if (review.guest.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this review',
      );
    }

    return await this.deleteReviewAndAssociatedReports(reviewId);
  }
}
