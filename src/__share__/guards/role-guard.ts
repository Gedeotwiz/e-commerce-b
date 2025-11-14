
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '../enum/enum';
import { ROLES_KEY } from '../decorator/role-decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || !requiredRoles.length) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) return false;

    const userRole = (user.role as string).toUpperCase();
    return requiredRoles.some((r) => r.toString().toUpperCase() === userRole);
  }
}
