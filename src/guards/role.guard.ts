import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	matchRoles(roles: string[], userRole: string) {
		return roles.some((role) => role === userRole);
	}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

		if (!roles) {
			return true;
		}
		const request = context.switchToHttp().getRequest();
		const user = request.user;

		return this.matchRoles(roles, user.role);
	}
}
