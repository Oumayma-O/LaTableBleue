import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/models/user.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UserRole } from '../users/UserRole.enum';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async validateUser(
    userId: string,
    roleModel: Model<User>,
    oldPassword: string,
  ): Promise<User> {
    const user = await this.userService.findUserModelById(userId, roleModel);

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
    const roleModel = this.userService.getUserModelByRole(role);
    const user = await this.validateUser(
      userId,
      roleModel,
      updatePasswordDto.currentPassword,
    );

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    user.password = hashedPassword;

    // Save the updated user
    return user.save();
  }
}
