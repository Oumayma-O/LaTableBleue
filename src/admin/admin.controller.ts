import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { Admin } from './admin.model';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get(':id')
  async getAdminById(@Param('id') id: string): Promise<Admin | null> {
    return this.adminService.findAdminById(id);
  }

  @Get('email/:email')
  async getAdminByEmail(@Param('email') email: string): Promise<Admin | null> {
    return this.adminService.findAdminByEmail(email);
  }

  @Patch(':id')
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: Partial<CreateAdminDto>,
  ): Promise<Admin | null> {
    return this.adminService.updateAdmin(id, updateAdminDto);
  }

  @Delete(':id')
  async deleteAdmin(@Param('id') id: string): Promise<{ success: boolean }> {
    const deleted = await this.adminService.deleteAdmin(id);
    return { success: deleted };
  }
}
