import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    async getInventorySummary() {
        const products = await this.prisma.product.findMany({
            select: {
                stock: true,
                price: true,
                retailEnabled: true,
                retailPrice: true,
            },
        });

        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
        const inventoryValue = products.reduce((sum, p) => {
            const price = p.retailEnabled && p.retailPrice ? p.retailPrice : p.price;
            return sum + (Number(price) * p.stock);
        }, 0);

        // Reserved stock would ideally come from non-fulfilled orders
        const reservedStock = await this.prisma.orderItem.aggregate({
            where: {
                order: {
                    status: { in: ['PENDING', 'PROCESSING'] }
                }
            },
            _sum: { quantity: true }
        });

        return {
            totalStock,
            reserved: reservedStock._sum.quantity || 0,
            damaged: 0, // Not in schema yet
            inventoryValue,
        };
    }

    async getOrdersSummary() {
        const [totalOrders, pendingCount, revenue] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { status: 'PENDING' } }),
            this.prisma.order.aggregate({
                where: { paymentStatus: 'COMPLETED' },
                _sum: { total: true },
            }),
        ]);

        return {
            totalOrders,
            pendingCount,
            revenue: revenue._sum.total || 0,
        };
    }

    async getDashboardStats() {
        const [
            totalProducts,
            totalOrders,
            totalCustomers,
            pendingOrders,
            totalRevenue,
            lowStockProducts,
            activeCarts,
            orderGrowth,
            revenueGrowth,
            customerGrowth
        ] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.order.count(),
            this.prisma.customer.count(),
            this.prisma.order.count({ where: { status: 'PENDING' } }),
            this.prisma.order.aggregate({
                where: { paymentStatus: 'COMPLETED' },
                _sum: { total: true },
            }),
            this.prisma.product.count({ where: { stock: { lte: 10 } } }),
            this.prisma.cart.count(),
            // Mock growth values for now, or calculate based on last 30 days
            Promise.resolve(12),  // orderGrowth
            Promise.resolve(8.5), // revenueGrowth
            Promise.resolve(15),  // customerGrowth
        ]);

        const avgOrderValue = totalOrders > 0 ? (Number(totalRevenue._sum.total || 0) / totalOrders) : 0;
        const abandonmentRate = activeCarts > 0 ? Math.round((activeCarts / (totalOrders + activeCarts)) * 100) : 0;

        return {
            totalProducts,
            activeOrders: totalOrders,
            totalCustomers,
            pendingOrders,
            totalRevenue: Number(totalRevenue._sum.total || 0),
            revenueGrowth,
            orderGrowth,
            newRegistrations: totalCustomers, // Simplified
            customerGrowth,
            avgOrderValue,
            aovGrowth: 5.2,
            lowStockProducts,
            siteStatus: 'OPTIMAL',
            abandonmentRate,
            conversionRate: 3.4,
        };
    }

    async getRecentOrders(limit = 10) {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                customer: { select: { firstName: true, lastName: true, email: true } },
                items: { include: { product: { select: { name: true } } } },
            },
        });
    }

    async getSalesOverTime(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const orders = await this.prisma.order.findMany({
            where: {
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

    async getTopProducts(limit = 5) {
        const orderItems = await this.prisma.orderItem.groupBy({
            by: ['productId'],
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

    async getOrderStatusBreakdown() {
        const statuses = await this.prisma.order.groupBy({
            by: ['status'],
            _count: true,
        });

        return statuses.map((s) => ({ status: s.status, count: s._count }));
    }

    async getPendingReviews() {
        return this.prisma.review.count({
            where: { status: 'PENDING' },
        });
    }

    async getOperationalAlerts() {
        const alerts = [];

        const lowStock = await this.prisma.product.findMany({
            where: { stock: { lte: 5 } },
            take: 3
        });

        lowStock.forEach(p => {
            alerts.push({
                id: `stock-${p.id}`,
                title: `Low Stock: ${p.name}`,
                type: 'WARNING',
                time: 'Just now'
            });
        });

        const pendingOrders = await this.prisma.order.count({ where: { status: 'PENDING' } });
        if (pendingOrders > 0) {
            alerts.push({
                id: 'pending-orders',
                title: `${pendingOrders} Pending Orders`,
                type: 'CRITICAL',
                time: 'Requires attention'
            });
        }

        return alerts;
    }

    async getCartMetrics() {
        const [activeCarts, abandonedValue] = await Promise.all([
            this.prisma.cart.count(),
            this.prisma.cartItem.aggregate({
                _sum: { quantity: true }, // Simplified
            })
        ]);

        return {
            recoveredCarts: 12,
            lostRevenue: (abandonedValue._sum.quantity || 0) * 500, // Dummy calc
        };
    }
}
