import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './models/user.model';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserRole } from './UserRole.enum';
import { GuestService } from '../guest/guest.service';
import { AdminService } from '../admin/admin.service';
import { RestaurateurService } from '../restaurateur/restaurateur.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private guestService: GuestService,
    private adminService: AdminService,
    private restaurateurService: RestaurateurService,
  ) {}

  public static async createUser(
    roleModel: Model<User>,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException("Passwords don't match");
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = new roleModel({
      ...createUserDto,
      password: hashedPassword,
    });

    console.log(createdUser);
    return createdUser.save();
  }

  static async updateUser(
    roleModel: Model<User>,
    userId: string,
    updateDto: UpdateUserDto, // Replace with appropriate DTO type
  ): Promise<User> {
    // Retrieve the user to be updated

    const user = await roleModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user properties based on the update DTO
    for (const key in updateDto) {
      if (updateDto.hasOwnProperty(key)) {
        user[key] = updateDto[key];
      }
    }

    // Save the updated user
    return user.save();
  }

  async findUserByRoleAndUsername(
    role: UserRole,
    username: string,
  ): Promise<User> {
    console.log(`fuu role: ${role}, username: ${username}`);
    const userModel = this.getUserModelByRole(role);

    const user = await userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByRoleAndId(userId: string, role: UserRole): Promise<User> {
    const roleModel = this.getUserModelByRole(role);
    const user = await roleModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByEmailAndRole(role: UserRole, email: string): Promise<User> {
    console.log(`fuu role: ${role}, email: ${email}`);
    const userModel = this.getUserModelByRole(role);

    const user = await userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  getUserModelByRole(role: UserRole): Model<User> {
    console.log(`role: ${role}`);
    switch (role) {
      case UserRole.GUEST:
        return this.guestService.guestModel;
      case UserRole.ADMIN:
        return this.adminService.adminModel;
      case UserRole.RESTAURATEUR:
        return this.restaurateurService.restaurateurModel;
      // Handle other roles if needed
      default:
        throw new NotFoundException(`Unsupported role: ${role}`);
    }
  }
}
