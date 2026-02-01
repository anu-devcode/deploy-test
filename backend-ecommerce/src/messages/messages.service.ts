import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HelpMessageStatus, MessageSenderRole } from '@prisma/client';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) { }

    async findAllForCustomer(customerId: string, tenantId: string) {
        return this.prisma.helpMessage.findMany({
            where: { customerId, tenantId, parentId: null },
            include: {
                replies: {
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getUnreadCount(customerId: string, tenantId: string) {
        return this.prisma.helpMessage.count({
            where: {
                customerId,
                tenantId,
                isRead: false,
                senderRole: 'ADMIN',
            },
        });
    }

    async findOne(id: string, tenantId: string) {
        return this.prisma.helpMessage.findUnique({
            where: { id, tenantId },
            include: {
                replies: {
                    orderBy: { createdAt: 'asc' },
                },
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                }
            },
        });
    }

    async findAllForAdmin(tenantId: string) {
        return this.prisma.helpMessage.findMany({
            where: { tenantId, parentId: null },
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                replies: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(data: {
        tenantId: string;
        customerId: string;
        subject?: string;
        content: string;
        senderRole: MessageSenderRole;
        parentId?: string;
    }) {
        if (data.parentId) {
            // Update parent status if customer is replying
            if (data.senderRole === 'CUSTOMER') {
                await this.prisma.helpMessage.update({
                    where: { id: data.parentId },
                    data: { status: 'OPEN' }
                });
            } else {
                // Admin/Staff replying
                await this.prisma.helpMessage.update({
                    where: { id: data.parentId },
                    data: { status: 'IN_PROGRESS' }
                });
            }
        }

        return this.prisma.helpMessage.create({
            data,
        });
    }

    async updateStatus(id: string, status: HelpMessageStatus, tenantId: string) {
        return this.prisma.helpMessage.update({
            where: { id, tenantId },
            data: { status },
        });
    }

    async markAsRead(id: string, customerId: string, tenantId: string) {
        return this.prisma.helpMessage.updateMany({
            where: {
                OR: [
                    { id, customerId, tenantId },
                    { parentId: id, customerId, tenantId }
                ],
                senderRole: 'ADMIN'
            },
            data: { isRead: true }
        });
    }
}
