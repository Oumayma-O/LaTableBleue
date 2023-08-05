import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isMenuOrMenuImageRequired', async: false })
export class IsMenuOrMenuImageRequiredConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const menu = args.object['menu'];
    const menuImages = args.object['menuImages'];

    return !!menu || !!menuImages;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Either menu or menuImages is required.';
  }
}

export function IsMenuOrMenuImagesRequired(
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isMenuOrMenuImagesRequired',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsMenuOrMenuImageRequiredConstraint,
    });
  };
}
