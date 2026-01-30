import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateStaffDto, tenantId: string) {
        const existing = await this.prisma.user.findFirst({
            where: { email: dto.email, tenantId }
        });

        if (existing) throw new ConflictException('Staff with this email already exists');

        const hashedPassword = await bcrypt.hash(dto.password || 'Temporary123!', 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: dto.role,
                tenantId,
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

        return this.findOne(user.id, tenantId);
    }

    async findAll(tenantId: string) {
        return this.prisma.user.findMany({
            where: { tenantId, role: { in: ['ADMIN', 'STAFF'] } },
            include: { permissions: { include: { permission: true } } }
        });
    }

    async findOne(id: string, tenantId: string) {
        const staff = await this.prisma.user.findFirst({
            where: { id, tenantId },
            include: { permissions: { include: { permission: true } } }
        });
        if (!staff) throw new NotFoundException('Staff not found');
        return staff;
    }

    async update(id: string, dto: UpdateStaffDto, tenantId: string) {
        await this.findOne(id, tenantId);

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

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId);
        return this.prisma.user.delete({ where: { id } });
    }
}
