import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Restaurant, RestaurantDocument } from './restaurant.model';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async findById(id: Types.ObjectId): Promise<RestaurantDocument | null> {
    return this.restaurantModel.findById(id).exec();
  }

  // Add more methods as needed for interacting with the Restaurant model
}