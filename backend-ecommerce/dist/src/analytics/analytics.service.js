"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(tenantId) {
        const [totalProducts, totalOrders, totalCustomers, pendingOrders, totalRevenue, lowStockProducts,] = await Promise.all([
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
    async getRecentOrders(tenantId, limit = 10) {
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
    async getSalesOverTime(tenantId, days = 30) {
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
        const salesByDay = {};
        orders.forEach((order) => {
            const day = order.createdAt.toISOString().split('T')[0];
            salesByDay[day] = (salesByDay[day] || 0) + Number(order.total);
        });
        return Object.entries(salesByDay).map(([date, total]) => ({ date, total }));
    }
    async getTopProducts(tenantId, limit = 5) {
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
    async getOrderStatusBreakdown(tenantId) {
        const statuses = await this.prisma.order.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: true,
        });
        return statuses.map((s) => ({ status: s.status, count: s._count }));
    }
    async getPendingReviews(tenantId) {
        return this.prisma.review.count({
            where: { tenantId, status: 'PENDING' },
        });
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map