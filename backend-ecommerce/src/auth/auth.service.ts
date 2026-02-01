import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, ResetPasswordDto, AuthPortal } from './dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto, userAgent?: string, ipAddress?: string) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: (dto.role || Role.CUSTOMER) as any,
            },
        });

        return this.generateTokens(user.id, user.email, user.role, [], user.email, userAgent, ipAddress);
    }

    async login(dto: LoginDto, userAgent?: string, ipAddress?: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
                deletedAt: null
            } as any,
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Portal-specific role checks
        if (dto.portal === AuthPortal.ADMIN) {
            if (user.role !== Role.ADMIN && user.role !== Role.SUPERADMIN && user.role !== Role.STAFF) {
                throw new UnauthorizedException('Access denied to admin portal');
            }
        }

        const passwordValid = await bcrypt.compare(dto.password, user.password);

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const permissionNames = (user as any).permissions.map((p: any) => p.permission.name);
        return this.generateTokens(user.id, user.email, user.role, permissionNames, user.email, userAgent, ipAddress);
    }

    async refresh(refreshToken: string, userAgent?: string, ipAddress?: string) {
        const tokenData = await (this.prisma as any).refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: { include: { permissions: { include: { permission: true } } } } }
        });

        if (!tokenData || tokenData.isRevoked || tokenData.expiresAt < new Date()) {
            if (tokenData?.isRevoked) {
                // Potential attack! Revoke all tokens for this user.
                await this.prisma.refreshToken.updateMany({
                    where: { userId: tokenData.userId },
                    data: { isRevoked: true }
                });
            }
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        // Revoke the old token (rotation)
        await this.prisma.refreshToken.update({
            where: { id: tokenData.id },
            data: { isRevoked: true }
        });

        const user = tokenData.user;
        const permissionNames = (user as any).permissions.map((p: any) => p.permission.name);
        // Carry over primary status if the refreshing token was primary? 
        // Or handle it in generateTokens by checking existing active sessions.
        return this.generateTokens(user.id, user.email, user.role, permissionNames, user.email, userAgent, ipAddress);
    }

    async logout(refreshToken: string) {
        await (this.prisma as any).refreshToken.updateMany({
            where: { token: refreshToken },
            data: { isRevoked: true }
        });
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

    async listSessions(userId: string) {
        return (this.prisma as any).refreshToken.findMany({
            where: {
                userId,
                isRevoked: false,
                expiresAt: { gt: new Date() }
            },
            select: {
                id: true,
                userAgent: true,
                ipAddress: true,
                isPrimary: true,
                lastUsedAt: true,
                createdAt: true
            },
            orderBy: { createdAt: 'asc' }
        });
    }

    async revokeSession(userId: string, sessionId: string, currentToken: string) {
        // Check if the current token is primary
        const currentActive = await (this.prisma as any).refreshToken.findUnique({
            where: { token: currentToken }
        });

        if (!currentActive || !currentActive.isPrimary) {
            throw new UnauthorizedException('Only the primary device can manage sessions');
        }

        await (this.prisma as any).refreshToken.update({
            where: { id: sessionId, userId },
            data: { isRevoked: true }
        });
    }

    async logoutAllDevices(userId: string) {
        await (this.prisma as any).refreshToken.updateMany({
            where: { userId },
            data: { isRevoked: true }
        });
    }

    async deleteAccount(userId: string, currentToken: string) {
        const currentActive = await this.prisma.refreshToken.findUnique({
            where: { token: currentToken }
        });

        if (!currentActive || !currentActive.isPrimary) {
            throw new UnauthorizedException('Only the primary device can delete the account');
        }

        // Soft delete
        await this.prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date() } as any
        });

        await this.logoutAllDevices(userId);
    }

    async getStoreConfig() {
        let config = await (this.prisma as any).storeConfig.findUnique({
            where: { id: 'global' }
        });

        if (!config) {
            config = await (this.prisma as any).storeConfig.create({
                data: { id: 'global', isSocialLoginEnabled: true }
            });
        }
        return config;
    }

    async updateStoreConfig(isSocialLoginEnabled: boolean) {
        return (this.prisma as any).storeConfig.upsert({
            where: { id: 'global' },
            update: { isSocialLoginEnabled },
            create: { id: 'global', isSocialLoginEnabled }
        });
    }

    // Two-Factor Authentication Methods
    async getTwoFactorSettings(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                twoFactorEnabled: true,
                twoFactorMethod: true
            }
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateTwoFactorSettings(userId: string, enabled: boolean, method?: string) {
        const updateData: any = { twoFactorEnabled: enabled };

        if (enabled && method) {
            updateData.twoFactorMethod = method;
        } else if (!enabled) {
            updateData.twoFactorMethod = null;
            updateData.twoFactorSecret = null;
            updateData.twoFactorBackupCodes = [];
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                twoFactorEnabled: true,
                twoFactorMethod: true
            }
        });
    }

    private async generateTokens(userId: string, email: string, role: string, permissions: string[] = [], name: string = '', userAgent?: string, ipAddress?: string) {
        const payload = { sub: userId, email, role, permissions, name };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m' // Short-lived
        });

        const refreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        // Check if this is the first active session
        const activeSessionsCount = await (this.prisma as any).refreshToken.count({
            where: {
                userId,
                isRevoked: false,
                expiresAt: { gt: new Date() }
            }
        });

        const isPrimary = activeSessionsCount === 0;

        await (this.prisma as any).refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt,
                userAgent,
                ipAddress,
                isPrimary
            }
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: { id: userId, email, role, permissions, name, isPrimary }
        };
    }
}
