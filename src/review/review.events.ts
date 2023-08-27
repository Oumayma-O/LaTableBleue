import { Review } from './models/review.model';

export class ReviewDeletedEvent {
  constructor(public deletedReview: Review) {}
}
