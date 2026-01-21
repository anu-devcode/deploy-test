import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(tenantId: string): Promise<{
        totalProducts: number;
        totalOrders: number;
        totalCustomers: number;
        pendingOrders: number;
        totalRevenue: number | import("@prisma/client-runtime-utils").Decimal;
        lowStockProducts: number;
    }>;
    getRecentOrders(tenantId: string, limit?: number): Promise<({
        customer: {
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        items: ({
            product: {
                name: string;
            };
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            productId: string;
            orderId: string;
            quantity: number;
        })[];
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderNumber: string | null;
        total: import("@prisma/client-runtime-utils").Decimal;
        subtotal: import("@prisma/client-runtime-utils").Decimal | null;
        shippingTotal: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
        paymentRef: string | null;
        shippingMethod: string | null;
        shippingAddress: string | null;
        shippingCity: string | null;
        shippingCountry: string | null;
        trackingNumber: string | null;
        notes: string | null;
        customerId: string;
    })[]>;
    getSalesOverTime(tenantId: string, days?: number): Promise<{
        date: string;
        total: number;
    }[]>;
    getTopProducts(tenantId: string, limit?: number): Promise<{
        product: {
            name: string;
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            images: string[];
        } | undefined;
        totalSold: number | null;
    }[]>;
    getOrderStatusBreakdown(tenantId: string): Promise<{
        status: import("@prisma/client").$Enums.OrderStatus;
        count: number;
    }[]>;
    getPendingReviews(tenantId: string): Promise<number>;
}
