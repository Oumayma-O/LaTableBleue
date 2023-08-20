import {
  BadRequestException,
  ConflictException,
  Injectable,
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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Guest.name) private GuestModel: Model<Guest>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Restaurateur.name)
    private restaurateurModel: Model<Restaurateur>,
  ) {}

  private async createUser(
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
    return this.createUser(this.GuestModel, createGuestDto);
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    return this.createUser(this.adminModel, createAdminDto);
  }

  async createRestaurateur(
    createRestaurateurDto: CreateRestaurateurDto,
  ): Promise<User> {
    return this.createUser(this.restaurateurModel, createRestaurateurDto);
  }
}
