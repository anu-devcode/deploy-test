import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, UpdateDeliveryDto } from './dto';
export declare class DeliveryController {
    private readonly deliveryService;
    constructor(deliveryService: DeliveryService);
    create(dto: CreateDeliveryDto, tenantId: string): Promise<{
        order: {
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
        };
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.DeliveryStatus;
        notes: string | null;
        driverName: string | null;
        driverPhone: string | null;
        vehicleInfo: string | null;
        estimatedTime: Date | null;
        actualDelivery: Date | null;
        orderId: string;
    }>;
    findAll(tenantId: string): Promise<({
        order: {
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
        };
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.DeliveryStatus;
        notes: string | null;
        driverName: string | null;
        driverPhone: string | null;
        vehicleInfo: string | null;
        estimatedTime: Date | null;
        actualDelivery: Date | null;
        orderId: string;
    })[]>;
    findOne(id: string, tenantId: string): Promise<{
        order: {
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
        };
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.DeliveryStatus;
        notes: string | null;
        driverName: string | null;
        driverPhone: string | null;
        vehicleInfo: string | null;
        estimatedTime: Date | null;
        actualDelivery: Date | null;
        orderId: string;
    }>;
    findByOrder(orderId: string, tenantId: string): Promise<({
        order: {
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
        };
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.DeliveryStatus;
        notes: string | null;
        driverName: string | null;
        driverPhone: string | null;
        vehicleInfo: string | null;
        estimatedTime: Date | null;
        actualDelivery: Date | null;
        orderId: string;
    }) | null>;
    update(id: string, dto: UpdateDeliveryDto, tenantId: string): Promise<{
        order: {
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
        };
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.DeliveryStatus;
        notes: string | null;
        driverName: string | null;
        driverPhone: string | null;
        vehicleInfo: string | null;
        estimatedTime: Date | null;
        actualDelivery: Date | null;
        orderId: string;
    }>;
    updateStatus(id: string, status: string, tenantId: string): Promise<{
        order: {
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
        };
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.DeliveryStatus;
        notes: string | null;
        driverName: string | null;
        driverPhone: string | null;
        vehicleInfo: string | null;
        estimatedTime: Date | null;
        actualDelivery: Date | null;
        orderId: string;
    }>;
}
