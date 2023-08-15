import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './restaurant.model';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { hashPassword } from '../auth/utils/auth.utils';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const hashedPassword = await hashPassword(createRestaurantDto.managerPassword);
    const createdRestaurant = new this.restaurantModel({...createRestaurantDto, managerPassword:hashedPassword});
    return createdRestaurant.save();
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.find().exec();
  }

  async findOne(id: string): Promise<Restaurant | null> {
    return this.restaurantModel.findById(id).exec();
  }

  async update(id: string, updateRestaurantDto: CreateRestaurantDto): Promise<Restaurant | null> {
    if (updateRestaurantDto.managerPassword) {
      updateRestaurantDto.managerPassword = await hashPassword(updateRestaurantDto.managerPassword);
    }
    return this.restaurantModel.findByIdAndUpdate(id, updateRestaurantDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Restaurant | null> {
    return this.restaurantModel.findByIdAndDelete(id).exec();
  }
}
