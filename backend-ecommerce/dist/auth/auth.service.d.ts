import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto, tenantId: string): Promise<{
        access_token: string;
    }>;
    login(dto: LoginDto, tenantId: string): Promise<{
        access_token: string;
    }>;
    requestPasswordReset(email: string, tenantId: string): Promise<{
        message: string;
        token: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private generateToken;
}
