import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    create(dto: CreateStaffDto, tenantId: string): Promise<{
        permissions: ({
            permission: {
                id: string;
                name: string;
                description: string | null;
            };
        } & {
            userId: string;
            permissionId: string;
        })[];
    } & {
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isFirstLogin: boolean;
    }>;
    findAll(tenantId: string): Promise<({
        permissions: ({
            permission: {
                id: string;
                name: string;
                description: string | null;
            };
        } & {
            userId: string;
            permissionId: string;
        })[];
    } & {
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isFirstLogin: boolean;
    })[]>;
    findOne(id: string, tenantId: string): Promise<{
        permissions: ({
            permission: {
                id: string;
                name: string;
                description: string | null;
            };
        } & {
            userId: string;
            permissionId: string;
        })[];
    } & {
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isFirstLogin: boolean;
    }>;
    update(id: string, dto: UpdateStaffDto, tenantId: string): Promise<({
        permissions: ({
            permission: {
                id: string;
                name: string;
                description: string | null;
            };
        } & {
            userId: string;
            permissionId: string;
        })[];
    } & {
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isFirstLogin: boolean;
    }) | null>;
    remove(id: string, tenantId: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isFirstLogin: boolean;
    }>;
}
