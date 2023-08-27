import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/UserRole.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // No roles defined, allow access
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request.jwtPayload.role; // Assuming role is in jwtPayload

    return requiredRoles.includes(userRole);
  }
}
