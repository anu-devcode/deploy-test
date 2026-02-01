import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: dto.role || 'STAFF',
            },
        });

        return this.generateToken(user.id, user.email, user.role);
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(dto.password, user.password);

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user.id, user.email, user.role);
    }

    async requestPasswordReset(email: string) {
        const user = await this.prisma.user.findFirst({
            where: { email }
        });

        if (!user) {
            // Silently fail or throw to avoid email enumeration
            throw new NotFoundException('User not found');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

        await this.prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt
            }
        });

        // In a real app, send email here. For now, returning token for simulation/testing.
        return { message: 'Reset token generated', token };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token: dto.token },
            include: { user: true }
        });

        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new BadRequestException('Invalid or expired token');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword, isFirstLogin: false }
            }),
            this.prisma.passwordResetToken.delete({
                where: { id: resetToken.id }
            })
        ]);

        return { message: 'Password successfully reset' };
    }

    private generateToken(userId: string, email: string, role: string) {
        const payload = { sub: userId, email, role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
