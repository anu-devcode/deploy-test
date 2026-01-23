import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCustomerDto, tenantId: string): Promise<{
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
    }>;
    findAll(tenantId: string): Promise<({
        orders: {
            id: string;
            createdAt: Date;
            total: import("@prisma/client-runtime-utils").Decimal;
            status: import("@prisma/client").$Enums.OrderStatus;
        }[];
        _count: {
            orders: number;
        };
    } & {
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
    })[]>;
    findOne(id: string, tenantId: string): Promise<{
        cart: ({
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
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                quantity: number;
                cartId: string;
            })[];
        } & {
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
        }) | null;
        orders: ({
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
        })[];
    } & {
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
    }>;
    findByEmail(email: string, tenantId: string): Promise<{
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
    } | null>;
    update(id: string, dto: UpdateCustomerDto, tenantId: string): Promise<{
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
    }>;
    remove(id: string, tenantId: string): Promise<{
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
    }>;
    getCustomerStats(tenantId: string): Promise<{
        totalCustomers: number;
        customersThisMonth: number;
    }>;
}
