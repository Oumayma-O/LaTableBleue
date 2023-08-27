import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { User } from '../users/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../users/user.service';
import { Admin } from './models/admin.model';
import { UpdateUserDto } from '../users/dto/updateUser.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) public adminModel: Model<Admin>) {}

  async createAdmin(createAdminDto: CreateUserDto): Promise<User> {
    return UserService.createUser(this.adminModel, createAdminDto);
  }

  async updateAdmin(
    userId: string,
    updateAdminDto: UpdateUserDto,
  ): Promise<User> {
    return UserService.updateUser(this.adminModel, userId, updateAdminDto);
  }

  async deleteAdminWithAssociatedData(adminId: string): Promise<void> {
    // Delete the admin
    await this.adminModel.findByIdAndDelete(adminId).exec();
  }

  async findAllAdmins(): Promise<User[]> {
    return this.adminModel.find({ deletedAt: null }).exec();
  }
}
