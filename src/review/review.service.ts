import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import  { Model } from 'mongoose';
import { Review } from './review.model';
import { RestaurantService } from '../restaurant/restaurant.service';
import {UserService} from "../users/user.service";
import {CreateReviewDto} from "./dto/createReview.dto";
import * as mongoose from 'mongoose';
import {ObjectId} from "mongodb";


@Injectable()
export class ReviewService {
    constructor(
        @InjectModel('Review') private readonly reviewModel: Model<Review>,
        private readonly restaurantService: RestaurantService,
        private readonly guestService: UserService,
    ) {}



    async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
        // Convert string IDs to ObjectId
        const guestObjectId = new mongoose.Types.ObjectId(createReviewDto.guest);
        const restaurantObjectId = new mongoose.Types.ObjectId(createReviewDto.restaurant);

        // Create the review using the reviewModel
        const createdReview = new this.reviewModel({
            ...createReviewDto,
            guest: guestObjectId,
            restaurant: restaurantObjectId,
        });

        await createdReview.save();

        // Update the review arrays in Restaurant and Guest models
        await this.restaurantService.addReviewToRestaurant(restaurantObjectId, createdReview._id);
        await this.guestService.addReviewToGuest(guestObjectId, createdReview._id);

        return createdReview;
    }

    async updateReview(reviewId: string, updateReviewDto: Partial<Review>): Promise<Review> {
        const updatedReview = await this.reviewModel
            .findByIdAndUpdate(reviewId, updateReviewDto, { new: true })
            .exec();

        if (!updatedReview) {
            throw new NotFoundException(`Review with id ${reviewId} not found`);
        }
        if(updateReviewDto.rating) {
            await this.restaurantService.updateAverageRating(updatedReview.restaurant.toString());
        }
        return updatedReview;
    }

    async deleteReview(reviewId: string): Promise<void> {
        const review = await this.reviewModel.findByIdAndRemove(reviewId).exec();
        if (!review) {
            throw new NotFoundException(`Review with id ${reviewId} not found`);
        }

        await this.restaurantService.removeReviewFromRestaurant(review.restaurant, review._id);
        await this.guestService.removeReviewFromGuest(review.guest, review._id);
    }

}
