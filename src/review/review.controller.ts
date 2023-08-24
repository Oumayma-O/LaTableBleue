import {Body, Controller, Delete, Param, Post, Put} from '@nestjs/common';
import {CreateTableDto} from "../table/createTable.dto";
import {ReviewService} from "./review.service";
import {Review} from "./review.model";
import {CreateReviewDto} from "./dto/createReview.dto";

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post()
    async createReview(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
        return await this.reviewService.createReview(createReviewDto);
    }

    @Put(':id')
    async updateReview(@Param('id') id: string, @Body() updateReviewDto: Partial<Review>): Promise<Review> {
        return this.reviewService.updateReview(id, updateReviewDto);
    }

    @Delete(':id')
    async deleteReview(@Param('id') id: string): Promise<void> {
        return this.reviewService.deleteReview(id);
    }
}
