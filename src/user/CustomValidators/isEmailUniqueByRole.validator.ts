import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service'; // Import your User service here
import { ProfileType } from '../user.model'; // Import the enum for user roles

@Injectable()
@ValidatorConstraint({ name: 'isEmailUniqueByRole', async: true })
export class IsEmailUniqueByRoleConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UserService) {}

  async validate(email: string, args: any) {
    const user = await this.userService.findUserByEmailAndRole(
      email,
      args.constraints[0],
    );
    return !user;
  }

  defaultMessage() {
    return 'Email is already in use';
  }
}

export function IsEmailUniqueByRole(
  role: ProfileType,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isEmailUniqueByRole',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [role],
      validator: IsEmailUniqueByRoleConstraint,
    });
  };
}
