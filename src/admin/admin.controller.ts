import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/UserRole.enum';
import { UpdateGuestBioDto } from '../guest/dto/updateGuestBio.dto';
import { User } from '../users/models/user.model';
import { UpdateUserDto } from '../users/dto/updateUser.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Post()
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createAdmin(createUserDto);
  }

  @Put('update')
  @Roles(UserRole.ADMIN)
  async updateAdmin(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.adminService.updateAdmin(req.jwtPayload.sub, updateUserDto);
  }

  @Public()
  @Get()
  async findAllAdmins(): Promise<User[]> {
    return this.adminService.findAllAdmins();
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) // Apply authorization guard to ensure only admins can access
  async deleteAdminWithAssociatedData(@Param('id') adminId: string) {
    await this.adminService.deleteAdminWithAssociatedData(adminId);
    return { message: 'Admin deleted with associated data' };
  }
}
