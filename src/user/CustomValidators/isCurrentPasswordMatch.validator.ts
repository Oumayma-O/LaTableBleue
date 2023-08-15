import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { UserService } from '../user.service'; // Import your UserService
import * as bcrypt from 'bcrypt';

@Injectable()
@ValidatorConstraint({ name: 'currentPasswordMatch', async: true })
export class IsCurrentPasswordMatchConstraint
  implements ValidatorConstraintInterface
{
  constructor(private userService: UserService) {} // Inject your UserService

  async validate(value: any, args: ValidationArguments) {
    const objectId = args.object['_id']; // Access the _id property of the object
    const user = await this.userService.findOneById(objectId);
    if (!user) {
      return false;
    }

    // Use your password hashing/verification logic here, e.g., bcrypt.compare
    const isPasswordValid = await bcrypt.compare(value, user.password);
    return isPasswordValid;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Entered password does not match the current password';
  }
}

export function IsCurrentPasswordMatch(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'currentPasswordMatch',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsCurrentPasswordMatchConstraint,
    });
  };
}
