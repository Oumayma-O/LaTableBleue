import {
  Controller,
  Post,
  Body,
  UseFilters,
  Patch,
  Get,
  Param,
  Delete,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateGuestDto } from './dto/createGuest.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { DuplicateKeyExceptionFilter } from '../filters/DuplicateKeyExceptionFilter';
import { User } from './models/user.model';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateGuestBioDto } from './dto/updateGuestBio.dto';
import { UserRole } from './UserRole.enum';
import { CreateCreditCardDetailsDto } from './dto/createCreditCardDetails.dto';
import { UpdateCreditCardDetailsDto } from './dto/UpdateCreditCardDetails.dto';
import { UpdatePasswordDto } from '../auth/dto/updatePassword.dto';

@Controller('users')
@UseFilters(DuplicateKeyExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('Guests')
  createGuest(@Body() createGuestDto: CreateGuestDto) {
    return this.userService.createGuest(createGuestDto);
  }

  @Post('admins')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.createAdmin(createUserDto);
  }

  @Post('restaurateurs')
  createRestaurateur(@Body() createUserDto: CreateUserDto) {
    return this.userService.createRestaurateur(createUserDto);
  }

  //updates can be moved to dashboardes

  @Put('guest/:userId')
  async updateGuest(
    @Param('userId') userId: string,
    @Body() updateGuestDto: UpdateGuestBioDto,
  ): Promise<User> {
    return this.userService.updateGuest(userId, updateGuestDto);
  }

  @Put('admin/:userId')
  async updateAdmin(
    @Param('userId') userId: string,
    @Body() updateAdminDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateAdmin(userId, updateAdminDto);
  }

  @Put('restaurateur/:userId')
  async updateRestaurateur(
    @Param('userId') userId: string,
    @Body() updateRestaurateurDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateRestaurateur(userId, updateRestaurateurDto);
  }

  @Delete('guest/:userId')
  async deleteGuest(@Param('userId') userId: string): Promise<User> {
    return this.userService.deleteGuest(userId);
  }

  @Delete('admin/:userId')
  async deleteAdmin(@Param('userId') userId: string): Promise<User> {
    return this.userService.deleteAdmin(userId);
  }

  @Delete('restaurateur/:userId')
  async deleteRestaurateur(@Param('userId') userId: string): Promise<User> {
    return this.userService.deleteRestaurateur(userId);
  }

  @Patch('guest/soft-delete/:userId')
  async softDeleteGuest(@Param('userId') userId: string): Promise<User> {
    return this.userService.softDeleteGuest(userId);
  }

  @Patch('admin/soft-delete/:userId')
  async softDeleteAdmin(@Param('userId') userId: string): Promise<User> {
    return this.userService.softDeleteAdmin(userId);
  }

  @Patch('restaurateur/soft-delete/:userId/')
  async softDeleteRestaurateur(@Param('userId') userId: string): Promise<User> {
    return this.userService.softDeleteRestaurateur(userId);
  }

  @Get('guests')
  async findAllGuests(): Promise<User[]> {
    return this.userService.findAllGuests();
  }

  @Get('admins')
  async findAllAdmins(): Promise<User[]> {
    return this.userService.findAllAdmins();
  }

  @Get('restaurateurs')
  async findAllRestaurateurs(): Promise<User[]> {
    return this.userService.findAllRestaurateurs();
  }

  @Get(':role/:username')
  async findUserByUsername(
    @Param('role', ValidationPipe) role: UserRole,
    @Param('username') username: string,
  ): Promise<User> {
    return this.userService.findUserByUsername(username, role);
  }

  //@UseGuards(JwtAuthGuard)
  @Post('guest/credit-card-details/:userId')
  async createCreditCardDetails(
    // @CurrentUser('id') userId: string,
    @Param('userId') userId: string,
    @Body() createDto: CreateCreditCardDetailsDto,
  ) {
    return this.userService.createCreditCardDetails(userId, createDto);
  }

  //@UseGuards(JwtAuthGuard)
  @Patch('guest/credit-card-details/:userId')
  async updateCreditCardDetails(
    //@CurrentUser('id') userId: string,
    @Param('userId') userId: string,
    @Body() updateDto: UpdateCreditCardDetailsDto,
  ) {
    return this.userService.updateCreditCardDetails(userId, updateDto);
  }
}
