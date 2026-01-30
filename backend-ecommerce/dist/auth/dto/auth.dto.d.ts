import { Role } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    password: string;
    role?: Role;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RequestResetDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    password: string;
}
