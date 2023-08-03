import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/user.model';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserBioDto } from './dto/updateUserBio.dto';
import { UpdateCreditCardDetailsDto } from './dto/UpdateCreditCardDetails.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async updateUserBio(
    userId: string,
    updateUserBioDto: UpdateUserBioDto,
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, updateUserBioDto, {
      new: true,
    });
  }

  async updateUserCreditCardDetails(
    userId: string,
    updateCreditCardDetailsDto: UpdateCreditCardDetailsDto,
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $set: { creditCardDetails: updateCreditCardDetailsDto } },
      { new: true },
    );
  }

  async getUserById(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }

  async getUsers(filter: any): Promise<User[]> {
    return this.userModel.find(filter).exec();
  }

  async deleteUser(userId: string): Promise<User> {
    return this.userModel.findByIdAndDelete(userId);
  }

  async getUserBookings(userId: string): Promise<User> {
    return this.userModel
      .findById(userId)
      .populate('bookings') // Populate the 'bookings' property with associated Booking documents
      .exec();
  }
}
