import { Body, Controller, Param, Patch, ValidationPipe } from '@nestjs/common';
import { UserRole } from '../users/UserRole.enum';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Patch('update-password/:role/:userId')
  //@Role(UserRole.ADMIN) // Use the appropriate role here
  async updatePassword(
    @Param('role', ValidationPipe) role: UserRole, // Assuming you have a UserRole enum
    @Param('userId') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const updatedUser = await this.authService.updatePassword(
      userId,
      role,
      updatePasswordDto,
    );
    return updatedUser;
  }
}
