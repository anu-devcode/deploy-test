import { IsEmail, IsNotEmpty, IsEnum, IsOptional, IsArray, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateStaffDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password?: string;

    @IsEnum(Role)
    role: Role;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    permissionNames?: string[];
}

export class UpdateStaffDto {
    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    permissionNames?: string[];
}
