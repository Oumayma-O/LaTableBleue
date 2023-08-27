import { Global, Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './models/review.model';
import { EventEmitter2 } from 'eventemitter2';
import { ReviewDeletedEvent } from './review.events';

@Global()
@Module({
  controllers: [ReviewController],
  providers: [
    ReviewService,
    {
      provide: 'EventEmitter2', // Provide the EventEmitter2 token
      useValue: new EventEmitter2(), // Create a new instance of EventEmitter2
    },
    ReviewDeletedEvent, // Provide the event class
  ],
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
