import { Controller } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Controller('user')
export class UserController {
  constructor(private userRepository: UserRepository) {} // Ensure UserRepository is injected here
}
