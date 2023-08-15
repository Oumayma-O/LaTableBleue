import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { RestaurantRepository } from './restaurant.repository';


@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async getCancellationDeadline(id: Types.ObjectId): Promise<number> {
    const restaurant = await this.restaurantRepository.findById(id);
    if (restaurant && restaurant.cancellationDeadline) {
      return restaurant.cancellationDeadline;
    }
    return 0;
  }

  async getPaymentDelay(id: Types.ObjectId): Promise<number> {
    const restaurant = await this.restaurantRepository.findById(id);
    if (restaurant && restaurant.caution && restaurant.caution.paymentDelay) {
      return restaurant.caution.paymentDelay;
    }
    return 0;
  }

}
