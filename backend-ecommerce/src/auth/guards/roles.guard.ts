import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles && !requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const { user } = request;

        if (!user) {
            return false;
        }

        // 1. Role Check
        if (requiredRoles && requiredRoles.some((role) => user?.role === role)) {
            return true;
        }

        // 2. Permission Check (Granular)
        if (requiredPermissions) {
            // Fetch permissions if not already attached to user object
            const userPermissions = await this.prisma.userPermission.findMany({
                where: { userId: user.userId },
                include: { permission: true }
            });
            const permissionNames = userPermissions.map(up => up.permission.name);

            if (requiredPermissions.every(perm => permissionNames.includes(perm))) {
                return true;
            }
        }

        return false;
    }
}
