import { Role } from '@prisma/client';
export declare class CreateStaffDto {
    email: string;
    password?: string;
    role: Role;
    permissionNames?: string[];
}
export declare class UpdateStaffDto {
    role?: Role;
    permissionNames?: string[];
}
