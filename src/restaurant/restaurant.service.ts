import { Injectable } from '@nestjs/common';
import {Model, Types} from 'mongoose';
import { RestaurantRepository } from './restaurant.repository';
import {InjectModel} from "@nestjs/mongoose";
import {Restaurant} from "./models/restaurant.model";
import {CreateRestaurantDto} from "./dto/createRestaurant.dto";

@Injectable()
export class RestaurantService {
  //getCancelationDeadline
  //GetPayementdeadline
    constructor(
        @InjectModel(Restaurant.name) private readonly restaurantModel: Model<Restaurant>,
    ) {}

    async create(createRestaurantDto: CreateRestaurantDto) {
        const createdRestaurant = new this.restaurantModel(createRestaurantDto);
        return await createdRestaurant.save();
    }

    async findOne(id: string) {
        return await this.restaurantModel.findById(id);
    }

    async findAll(query: any) {
        return await this.restaurantModel.find(query);
    }

    async update(id: string, updateRestaurantDto: Partial<Restaurant>) {
        return await this.restaurantModel.findByIdAndUpdate(id, updateRestaurantDto, {
            new: true, // Return the updated document
        });
    }

    async remove(id: string) {
        return await this.restaurantModel.findByIdAndRemove(id);
    }

    async findRestaurantsByName(name: string): Promise<Restaurant[]> {
        return this.restaurantModel.find({ name:name }).exec();
    }

    async findRestaurantsByCuisine(cuisine: string): Promise<Restaurant[]> {
        return this.restaurantModel.find({ cuisine: cuisine }).exec();
    }

    async findRestaurantsByCity(city: string): Promise<Restaurant[]> {
        return this.restaurantModel.find({ city: city }).exec();
    }

    async findRestaurantsByMeal(meal: string): Promise<Restaurant[]> {
        return this.restaurantModel.find({ meals: { $in: [meal] } }).exec();
    }

    async findRestaurantsByFeature(feature: string): Promise<Restaurant[]> {
        return this.restaurantModel.find({ features: { $in: [feature] } }).exec();
    }





}
