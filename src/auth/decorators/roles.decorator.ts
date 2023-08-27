import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/UserRole.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
