import { JwtGuard } from '../guards/jwt-guard';
import { UserRole } from '../enum/enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards, Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { AllowRoles } from './role-decorator';
import { RolesGuard } from '../guards/role-guard';

function Authorize(guard: Type<any>, ...roles: UserRole[]) {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(guard, RolesGuard), 
    AllowRoles(...roles),
  );
}

export function IsAdmin() {
  return Authorize(JwtGuard, UserRole.ADMIN);
}

export function IsSeller() {
  return Authorize(JwtGuard, UserRole.SELLER);
}

export function IsBuyer() {
  return Authorize(JwtGuard, UserRole.BUYER);
}

export function IsGuest() {
  return Authorize(JwtGuard, UserRole.GUEST);
}
