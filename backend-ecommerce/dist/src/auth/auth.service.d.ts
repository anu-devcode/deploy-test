import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
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
    private generateToken;
}
