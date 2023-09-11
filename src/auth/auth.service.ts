import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/models/user.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UserRole } from '../users/UserRole.enum';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { BlacklistService } from '../blacklist/blacklist.service';
import { BlacklistToken } from '../blacklist/models/blacklistToken.model';
import { GuestService } from '../guest/guest.service';
import { RestaurateurService } from '../restaurateur/restaurateur.service';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private guestService: GuestService,
    private adminService: AdminService,
    private restaurateurService: RestaurateurService,
    private jwtService: JwtService,
    private blacklistService: BlacklistService,
  ) {}
  async comparePwd(
    userId: string,
    role: UserRole,
    oldPassword: string,
  ): Promise<User> {
    const user = await this.userService.findUserByRoleAndId(userId, role);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid old password');
    }

    return user;
  }

  async updatePassword(
    userId: string,
    role: UserRole,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user = await this.comparePwd(
      userId,
      role,
      updatePasswordDto.currentPassword,
    );

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    user.password = hashedPassword;

    // Save the updated user
    return user.save();
  }

  async login(loginDto: LoginDto, role: UserRole): Promise<any> {
    const { email, password } = loginDto;

    const user = await this.userService.findUserByEmailAndRole(role, email);

    if (user && (await compare(password, user.password))) {
      const payload = { sub: user.id, email: user.email, role };
      const access_token = this.jwtService.sign(payload);
      return { access_token };
    } else {
      return null;
    }
  }

  async signUp(data: CreateUserDto, role: UserRole): Promise<any> {
    const roleModel: Model<User> = this.userService.getUserModelByRole(role);

    return UserService.createUser(roleModel, data);
  }

  async logout(token: string, expiresAt: Date): Promise<BlacklistToken> {
    const blacklistToken = await this.blacklistService.addTokenToBlacklist(
      token,
      expiresAt,
    );

    return blacklistToken; // Return the BlacklistToken
  }

  async signOutGuest(userId: string): Promise<void> {
    await this.guestService.deleteGuestWithAssociatedData(userId);
  }

  async signOutRestaurateur(userId: string): Promise<void> {
    await this.restaurateurService.deleteRestaurateurWithRestaurant(userId);
  }

  async signOutAdmin(userId: string): Promise<void> {
    await this.adminService.deleteAdminWithAssociatedData(userId);
  }

  async getProfile(userId: string, role: UserRole): Promise<User> {
    const userModel: Model<User> = this.userService.getUserModelByRole(role);
    return userModel.findById(userId);
  }
}
