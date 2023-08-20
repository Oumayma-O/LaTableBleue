import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateGuestDto } from './dto/createGuest.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { DuplicateKeyExceptionFilter } from '../filters/DuplicateKeyExceptionFilter';

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
}
