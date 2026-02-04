import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HelpMessageStatus, MessageSenderRole } from '@prisma/client';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) { }

    async findAllForCustomer(customerId: string) {
        return this.prisma.helpMessage.findMany({
            where: { customerId, parentId: null },
            include: {
                replies: {
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getUnreadCount(customerId: string) {
        return this.prisma.helpMessage.count({
            where: {
                customerId,
                isRead: false,
                senderRole: 'ADMIN',
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.helpMessage.findUnique({
            where: { id },
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

    async findByGuestEmail(email: string) {
        return this.prisma.helpMessage.findMany({
            where: { guestEmail: email, parentId: null },
            include: {
                replies: {
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findAllForAdmin() {
        return this.prisma.helpMessage.findMany({
            where: { parentId: null },
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
        customerId?: string;
        guestName?: string;
        guestEmail?: string;
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

    async updateStatus(id: string, status: HelpMessageStatus) {
        return this.prisma.helpMessage.update({
            where: { id },
            data: { status },
        });
    }

    async markAsRead(id: string, customerId: string) {
        return this.prisma.helpMessage.updateMany({
            where: {
                OR: [
                    { id, customerId },
                    { parentId: id, customerId }
                ],
                senderRole: 'ADMIN'
            },
            data: { isRead: true }
        });
    }
}
