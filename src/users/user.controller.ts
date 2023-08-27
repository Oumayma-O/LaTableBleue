import { Controller, Get, Param, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { UserRole } from './UserRole.enum';

import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get(':role/:username')
  async findUserByRoleAndUsername(
    @Param('role', ValidationPipe) role: UserRole,
    @Param('username') username: string,
  ): Promise<User> {
    return this.userService.findUserByRoleAndUsername(role, username);
  }
}
