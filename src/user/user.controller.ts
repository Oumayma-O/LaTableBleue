import { Controller, Post, Body } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('user')
export class UserController {
  constructor(private userRepository: UserRepository) {} // Ensure UserRepository is injected here

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userRepository.createUser(createUserDto);
  }
}
