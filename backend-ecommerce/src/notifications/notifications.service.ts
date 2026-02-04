import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, Role } from '@prisma/client';

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

    // Admin/Staff methods
    async findAllForAdmin(role: Role, userId: string) {
        return this.prisma.notification.findMany({
            where: {
                OR: [
                    { targetRole: role },
                    { targetUserId: userId },
                    { targetRole: null, targetUserId: null, customerId: null } // System-wide for all staff
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    async getUnreadCountForAdmin(role: Role, userId: string) {
        return this.prisma.notification.count({
            where: {
                isRead: false,
                OR: [
                    { targetRole: role },
                    { targetUserId: userId },
                    { targetRole: null, targetUserId: null, customerId: null }
                ]
            },
        });
    }

    async findRecent(customerId: string) {
        return this.prisma.notification.findMany({
            where: { customerId },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
    }

    async markAsRead(id: string, customerId?: string) {
        if (customerId) {
            const notification = await this.prisma.notification.findFirst({
                where: { id, customerId },
            });
            if (!notification) throw new NotFoundException('Notification not found');
        }

        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }

    async markAllAsRead(customerId: string) {
        return this.prisma.notification.updateMany({
            where: { customerId, isRead: false },
            data: { isRead: true },
        });
    }

    async markAllAsReadForAdmin(role: Role, userId: string) {
        return this.prisma.notification.updateMany({
            where: {
                isRead: false,
                OR: [
                    { targetRole: role },
                    { targetUserId: userId },
                    { targetRole: null, targetUserId: null, customerId: null }
                ]
            },
            data: { isRead: true },
        });
    }

    async create(data: {
        customerId?: string;
        type: NotificationType;
        title: string;
        message: string;
        link?: string;
        targetRole?: Role;
        targetUserId?: string;
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
