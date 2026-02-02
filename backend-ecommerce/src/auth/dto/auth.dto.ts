import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}

export enum AuthPortal {
    STOREFRONT = 'STOREFRONT',
    ADMIN = 'ADMIN'
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsEnum(AuthPortal)
    portal?: AuthPortal = AuthPortal.STOREFRONT;
}

export class RequestResetDto {
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}
