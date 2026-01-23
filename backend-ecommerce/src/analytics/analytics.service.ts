import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    async getDashboardStats(tenantId: string) {
        const [
            totalProducts,
            totalOrders,
            totalCustomers,
            pendingOrders,
            totalRevenue,
            lowStockProducts,
        ] = await Promise.all([
            this.prisma.product.count({ where: { tenantId } }),
            this.prisma.order.count({ where: { tenantId } }),
            this.prisma.customer.count({ where: { tenantId } }),
            this.prisma.order.count({ where: { tenantId, status: 'PENDING' } }),
            this.prisma.order.aggregate({
                where: { tenantId, paymentStatus: 'COMPLETED' },
                _sum: { total: true },
            }),
            this.prisma.product.count({ where: { tenantId, stock: { lte: 10 } } }),
        ]);

        return {
            totalProducts,
            totalOrders,
            totalCustomers,
            pendingOrders,
            totalRevenue: totalRevenue._sum.total || 0,
            lowStockProducts,
        };
    }

    async getRecentOrders(tenantId: string, limit = 10) {
        return this.prisma.order.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                customer: { select: { firstName: true, lastName: true, email: true } },
                items: { include: { product: { select: { name: true } } } },
            },
        });
    }

    async getSalesOverTime(tenantId: string, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const orders = await this.prisma.order.findMany({
            where: {
                tenantId,
                createdAt: { gte: startDate },
                paymentStatus: 'COMPLETED',
            },
            select: { createdAt: true, total: true },
            orderBy: { createdAt: 'asc' },
        });

        // Group by day
        const salesByDay: Record<string, number> = {};
        orders.forEach((order) => {
            const day = order.createdAt.toISOString().split('T')[0];
            salesByDay[day] = (salesByDay[day] || 0) + Number(order.total);
        });

        return Object.entries(salesByDay).map(([date, total]) => ({ date, total }));
    }

    async getTopProducts(tenantId: string, limit = 5) {
        const orderItems = await this.prisma.orderItem.groupBy({
            by: ['productId'],
            where: { order: { tenantId } },
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: limit,
        });

        const productIds = orderItems.map((item) => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true, price: true, images: true },
        });

        return orderItems.map((item) => ({
            product: products.find((p) => p.id === item.productId),
            totalSold: item._sum.quantity,
        }));
    }

    async getOrderStatusBreakdown(tenantId: string) {
        const statuses = await this.prisma.order.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: true,
        });

        return statuses.map((s) => ({ status: s.status, count: s._count }));
    }

    async getPendingReviews(tenantId: string) {
        return this.prisma.review.count({
            where: { tenantId, status: 'PENDING' },
        });
    }
}
