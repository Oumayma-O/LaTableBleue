import { Global, Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './models/review.model';
import { EventEmitter2 } from 'eventemitter2';
import { ReviewDeletedEvent } from './review.events';
import { ReviewEventHandlersService } from './review.EventHandler';

@Global()
@Module({
  controllers: [ReviewController],
  providers: [
    ReviewService,
    {
      provide: 'EventEmitter2',
      useValue: new EventEmitter2(),
    },
    ReviewDeletedEvent,
    ReviewEventHandlersService,
  ],
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  exports: [ReviewService, ReviewEventHandlersService],
})
export class ReviewModule {}
