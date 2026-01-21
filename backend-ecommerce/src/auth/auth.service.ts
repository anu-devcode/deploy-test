import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto, tenantId: string) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: dto.role || 'STAFF',
                tenantId,
            },
        });

        return this.generateToken(user.id, user.email, user.role, tenantId);
    }

    async login(dto: LoginDto, tenantId: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
                tenantId,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(dto.password, user.password);

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user.id, user.email, user.role, tenantId);
    }

    private generateToken(userId: string, email: string, role: string, tenantId: string) {
        const payload = { sub: userId, email, role, tenantId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
