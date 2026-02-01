import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async findAll(customerId: string) {
        return this.prisma.notification.findMany({
            where: { customerId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    async getUnreadCount(customerId: string) {
        return this.prisma.notification.count({
            where: { customerId, isRead: false },
        });
    }

    async findRecent(customerId: string) {
        return this.prisma.notification.findMany({
            where: { customerId },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
    }

    async markAsRead(id: string, customerId: string) {
        const notification = await this.prisma.notification.findFirst({
            where: { id, customerId },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }

    async create(data: {
        customerId?: string;
        type: NotificationType;
        title: string;
        message: string;
        link?: string;
    }) {
        return this.prisma.notification.create({
            data,
        });
    }

    async delete(id: string, customerId: string) {
        return this.prisma.notification.deleteMany({
            where: { id, customerId },
        });
    }
}
