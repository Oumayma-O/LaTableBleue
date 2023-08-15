import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ProfileType, User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserByEmailAndRole(
    email: string,
    role: ProfileType,
  ): Promise<UserDocument | null> {
    return this.userRepository.findByEmailAndRole(email, role);
  }
  async findUserByUsername(username: string): Promise<UserDocument | null> {
    return this.userRepository.findByUsername(username);
  }
  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOneById(id);
  }
}
