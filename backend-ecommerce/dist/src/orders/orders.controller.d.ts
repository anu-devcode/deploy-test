import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto, tenantId: string): Promise<{
        items: ({
            product: {
                tenantId: string;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
                compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
                stock: number;
                sku: string | null;
                images: string[];
                tags: string[];
                isPublished: boolean;
                isFeatured: boolean;
                categoryId: string | null;
                warehouseId: string | null;
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
    }>;
    findAll(tenantId: string): Promise<({
        customer: {
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
        };
        items: ({
            product: {
                tenantId: string;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
                compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
                stock: number;
                sku: string | null;
                images: string[];
                tags: string[];
                isPublished: boolean;
                isFeatured: boolean;
                categoryId: string | null;
                warehouseId: string | null;
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
    findOne(id: string, tenantId: string): Promise<{
        customer: {
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
        };
        items: ({
            product: {
                tenantId: string;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
                compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
                stock: number;
                sku: string | null;
                images: string[];
                tags: string[];
                isPublished: boolean;
                isFeatured: boolean;
                categoryId: string | null;
                warehouseId: string | null;
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
    }>;
    updateStatus(id: string, status: OrderStatus, tenantId: string): Promise<{
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
    }>;
    remove(id: string, tenantId: string): Promise<{
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
    }>;
}
