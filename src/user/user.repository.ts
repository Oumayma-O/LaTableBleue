import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfileType, User, UserDocument } from 'src/user/user.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmailAndRole(
    email: string,
    role: ProfileType,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, role }).exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userModel.findById(id).exec();
  }
}
