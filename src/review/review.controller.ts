import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Review } from './models/review.model';
import { UserRole } from '../users/UserRole.enum';
import { CreateReviewDto } from './dto/createReview.dto';
import { Report } from '../report/models/report.model';
import { UpdateReviewDto } from './dto/updateReview.dto';
import { ObjectId } from 'mongodb';
import { ParseObjectIdPipe } from '../Pipes/parse-object-id.pipe';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllReviews(): Promise<Review[]> {
    return this.reviewService.getAllReviews();
  }

  @Get(':reviewId')
  @Roles(UserRole.ADMIN)
  async getReviewById(@Param('reviewId') reviewId: string): Promise<Review> {
    return this.reviewService.getReviewById(reviewId);
  }

  @Post(':restaurantId')
  @Roles(UserRole.GUEST)
  async createReview(
    @Req() req,
    @Param('restaurantId', ParseObjectIdPipe) restaurantId: ObjectId,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return this.reviewService.CreateReview(
      req.jwtPayload.sub,
      restaurantId,
      createReviewDto,
    );
  }

  @Get(':reviewId/reports')
  @Roles(UserRole.GUEST)
  async getAllReports(
    @Req() req,
    @Param('reviewId') reviewId: string,
  ): Promise<Report[]> {
    return this.reviewService.getAllReports(req.jwtPayload.sub, reviewId);
  }

  @Put(':reviewId')
  @Roles(UserRole.GUEST)
  async updateReviewByUser(
    @Req() req,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewService.updateReviewByUser(
      req.jwtPayload.sub,
      reviewId,
      updateReviewDto,
    );
  }

  @Delete(':reviewId')
  @Roles(UserRole.GUEST)
  async deleteReviewByUser(
    @Req() req,
    @Param('reviewId') reviewId: string,
  ): Promise<Review> {
    return this.reviewService.deleteReviewByUser(req.jwtPayload.sub, reviewId);
  }

  @Get('hidden')
  @Roles(UserRole.ADMIN)
  async getHiddenReviews() {
    return this.reviewService.getHiddenReviews();
  }

  @Delete(':id/admin')
  @Roles(UserRole.ADMIN)
  async deleteReviewAndAssociatedReports(@Param('id') reviewId: string) {
    return this.reviewService.deleteReviewAndAssociatedReports(reviewId);
  }
}
