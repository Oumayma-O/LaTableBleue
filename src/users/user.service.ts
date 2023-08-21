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
import { Restaurateur } from './models/restaurateur.model';
import { Admin } from './models/admin.model';
import { Guest } from './models/guest.model';
import { CreateGuestDto } from './dto/createGuest.dto';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { CreateRestaurateurDto } from './dto/createRestaurateur.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateGuestBioDto } from './dto/updateGuestBio.dto';
import { UpdateCreditCardDetailsDto } from './dto/UpdateCreditCardDetails.dto';
import { CreditCardDetails } from './models/creditCardDetails.model';
import { CreateCreditCardDetailsDto } from './dto/createCreditCardDetails.dto';
import { UserRole } from './UserRole.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Guest.name) private guestModel: Model<Guest>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Restaurateur.name)
    private restaurateurModel: Model<Restaurateur>,
  ) {}

  private static async createUser(
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

    return createdUser.save();
  }

  async createGuest(createGuestDto: CreateGuestDto): Promise<User> {
    return UserService.createUser(this.guestModel, createGuestDto);
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    return UserService.createUser(this.adminModel, createAdminDto);
  }

  async createRestaurateur(
    createRestaurateurDto: CreateRestaurateurDto,
  ): Promise<User> {
    return UserService.createUser(
      this.restaurateurModel,
      createRestaurateurDto,
    );
  }

  private static async updateUser(
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

  async updateGuest(
    userId: string,
    updateDto: UpdateGuestBioDto,
  ): Promise<User> {
    return UserService.updateUser(this.guestModel, userId, updateDto);
  }

  async updateAdmin(
    userId: string,
    updateAdminDto: UpdateUserDto,
  ): Promise<User> {
    return UserService.updateUser(this.adminModel, userId, updateAdminDto);
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

  private static async deleteUser(
    roleModel: Model<User>,
    userId: string,
  ): Promise<User> {
    // Retrieve the user to be deleted
    const user = await roleModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete the user
    await user.deleteOne(); // Or user.deleteMany() for multiple documents
    return user;
  }

  async deleteGuest(userId: string): Promise<User> {
    return UserService.deleteUser(this.guestModel, userId);
  }

  async deleteAdmin(userId: string): Promise<User> {
    return UserService.deleteUser(this.adminModel, userId);
  }

  async deleteRestaurateur(userId: string): Promise<User> {
    return UserService.deleteUser(this.restaurateurModel, userId);
  }

  private static async softDeleteUser(
    roleModel: Model<User>,
    userId: string,
  ): Promise<User> {
    // Find the user to be "soft" deleted
    const user = await roleModel.findByIdAndUpdate(
      userId,
      { deletedAt: new Date() },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async softDeleteGuest(userId: string): Promise<User> {
    return UserService.softDeleteUser(this.guestModel, userId);
  }

  async softDeleteAdmin(userId: string): Promise<User> {
    return UserService.softDeleteUser(this.adminModel, userId);
  }

  async softDeleteRestaurateur(userId: string): Promise<User> {
    return UserService.softDeleteUser(this.restaurateurModel, userId);
  }

  async findAllGuests(): Promise<User[]> {
    return this.guestModel.find({ deletedAt: null }).exec();
  }

  async findAllAdmins(): Promise<User[]> {
    return this.adminModel.find({ deletedAt: null }).exec();
  }

  async findAllRestaurateurs(): Promise<User[]> {
    return this.restaurateurModel.find({ deletedAt: null }).exec();
  }

  async findUserByUsername(username: string, role: string): Promise<User> {
    let userModel: Model<User>;

    switch (role) {
      case 'guest':
        userModel = this.guestModel;
        break;
      case 'admin':
        userModel = this.adminModel;
        break;
      case 'restaurateur':
        userModel = this.restaurateurModel;
        break;
      default:
        throw new BadRequestException('Invalid role');
    }

    const user = await userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createCreditCardDetails(
    userId: string,
    createDto: CreateCreditCardDetailsDto,
  ): Promise<Guest> {
    const user = await this.guestModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedCardNumber = await bcrypt.hash(createDto.cardNumber, 10);
    const hashedExpiryDate = await bcrypt.hash(createDto.expiryDate, 10);
    const hashedCvv = await bcrypt.hash(createDto.cvv, 10);

    user.creditCardDetails = new CreditCardDetails({
      cardNumber: hashedCardNumber,
      expiryDate: hashedExpiryDate,
      cvv: hashedCvv,
    });

    return user.save();
  }

  async updateCreditCardDetails(
    userId: string,
    updateDto: UpdateCreditCardDetailsDto,
  ): Promise<Guest> {
    const user = await this.guestModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.creditCardDetails) {
      throw new NotFoundException('Credit card details not found');
    }

    for (const key in UpdateCreditCardDetailsDto) {
      if (UpdateCreditCardDetailsDto[key]) {
        user.creditCardDetails[key] = await bcrypt.hash(updateDto[key], 10);
      }
    }
    await user.save();
    return user;
  }

  async findUserModelById(
    userId: string,
    roleModel: Model<User>,
  ): Promise<User> {
    const user = await roleModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  getUserModelByRole(role: UserRole): Model<User> {
    switch (role) {
      case UserRole.GUEST:
        return this.guestModel;
      case UserRole.ADMIN:
        return this.adminModel;
      case UserRole.RESTAURATEUR:
        return this.restaurateurModel;
      // Handle other roles if needed
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
  }
}
