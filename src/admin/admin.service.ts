import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.model';
import { CreateAdminDto } from './dto/createAdmin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const createdAdmin = new this.adminModel(createAdminDto);
    return createdAdmin.save();
  }

  async findAdminById(id: string): Promise<Admin | null> {
    return this.adminModel.findById(id).exec();
  }

  async findAdminByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ email }).exec();
  }

  async updateAdmin(id: string, updateAdminDto: Partial<CreateAdminDto>): Promise<Admin | null> {
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(id, updateAdminDto, { new: true }).exec();
    if (!updatedAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return updatedAdmin;
  }

  async deleteAdmin(id: string): Promise<boolean> {
    const result = await this.adminModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }
}
