import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { User } from '../users/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurateur } from './models/restaurateur.model';
import { UserService } from '../users/user.service';
import { UpdateUserDto } from '../users/dto/updateUser.dto';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class RestaurateurService {
  constructor(
    @InjectModel(Restaurateur.name)
    public restaurateurModel: Model<Restaurateur>,
    private readonly restaurantService: RestaurantService,
  ) {}

  async createRestaurateur(
    createRestaurateurDto: CreateUserDto,
  ): Promise<User> {
    return UserService.createUser(
      this.restaurateurModel,
      createRestaurateurDto,
    );
  }

  async updateRestaurateur(
    userId: string,
    updateRestaurateurDto: UpdateUserDto,
  ): Promise<User> {
    return UserService.updateUser(
      this.restaurateurModel,
      userId,
      updateRestaurateurDto,
    );
  }

  async deleteRestaurateurWithRestaurant(
    restaurateurId: string,
  ): Promise<User> {
    const restaurateur = await this.restaurateurModel
      .findById(restaurateurId)
      .exec();
    if (!restaurateur) {
      throw new NotFoundException('Restaurateur not found');
    }

    if (restaurateur.restaurant) {
      await this.restaurantService.deleteRestaurantAndAssociatedData(
        restaurateur.restaurant,
      );
    }

    await restaurateur.deleteOne();
    return restaurateur;
  }

  async findAllRestaurateurs(): Promise<User[]> {
    return this.restaurateurModel.find({ deletedAt: null }).exec();
  }
}
