import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';

@Injectable()
export class StaffService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ) { }

    async create(dto: CreateStaffDto) {
        const existing = await this.prisma.user.findFirst({
            where: { email: dto.email }
        });

        if (existing) throw new ConflictException('Staff with this email already exists');

        // Map name to firstName/lastName if provided
        let firstName = dto.firstName;
        let lastName = dto.lastName;
        if (dto.name && !firstName && !lastName) {
            const parts = dto.name.split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ') || undefined;
        }

        // Generate temporary password if not provided
        const temporaryPassword = dto.password || this.generateTempPassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                role: dto.role,
                isFirstLogin: true, // Force password change on first login
            }
        });

        if (dto.permissionNames?.length) {
            for (const name of dto.permissionNames) {
                const permission = await this.prisma.permission.upsert({
                    where: { name },
                    update: {},
                    create: { name }
                });
                await this.prisma.userPermission.create({
                    data: {
                        userId: user.id,
                        permissionId: permission.id
                    }
                });
            }
        }

        // Send staff invite email with credentials
        const staffName = [dto.firstName, dto.lastName].filter(Boolean).join(' ') || dto.email;
        await this.emailService.sendStaffInvite(dto.email, staffName, temporaryPassword);

        return this.findOne(user.id);
    }

    private generateTempPassword(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    async findAll() {
        return this.prisma.user.findMany({
            where: { role: { in: ['ADMIN', 'STAFF'] } },
            include: { permissions: { include: { permission: true } } }
        });
    }

    async findOne(id: string) {
        const staff = await this.prisma.user.findFirst({
            where: { id },
            include: { permissions: { include: { permission: true } } }
        });
        if (!staff) throw new NotFoundException('Staff not found');
        return staff;
    }

    async update(id: string, dto: UpdateStaffDto) {
        await this.findOne(id);

        return this.prisma.$transaction(async (tx) => {
            if (dto.role) {
                await tx.user.update({ where: { id }, data: { role: dto.role } });
            }

            if (dto.permissionNames) {
                await tx.userPermission.deleteMany({ where: { userId: id } });
                for (const name of dto.permissionNames) {
                    const permission = await tx.permission.upsert({
                        where: { name },
                        update: {},
                        create: { name }
                    });
                    await tx.userPermission.create({
                        data: {
                            userId: id,
                            permissionId: permission.id
                        }
                    });
                }
            }

            return tx.user.findUnique({
                where: { id },
                include: { permissions: { include: { permission: true } } }
            });
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.user.delete({ where: { id } });
    }

    async resetPassword(id: string) {
        const staff = await this.findOne(id);
        const tempPassword = this.generateTempPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await this.prisma.user.update({
            where: { id },
            data: {
                password: hashedPassword,
                isFirstLogin: true
            }
        });

        const staffName = [staff.firstName, staff.lastName].filter(Boolean).join(' ') || staff.email;
        // Re-use sendStaffInvite as it contains the temporary password logic
        await this.emailService.sendStaffInvite(staff.email, staffName, tempPassword);

        return { tempPassword };
    }
}
