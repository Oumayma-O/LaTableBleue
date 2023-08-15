import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service'; // Import your User service here

@Injectable()
@ValidatorConstraint({ name: 'isUsernameUnique', async: true })
export class IsUsernameUniqueConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UserService) {}

  async validate(username: string) {
    const user = await this.userService.findUserByUsername(username);
    return !user;
  }

  defaultMessage() {
    return 'Username is already in use';
  }
}

export function IsUsernameUnique(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isUsernameUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUsernameUniqueConstraint,
    });
  };
}
