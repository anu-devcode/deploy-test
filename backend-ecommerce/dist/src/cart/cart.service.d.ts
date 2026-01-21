import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto, CheckoutDto } from './dto';
import { Prisma } from '@prisma/client';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrCreateCart(customerId: string, tenantId: string): Promise<any>;
    addToCart(customerId: string, dto: AddToCartDto, tenantId: string): Promise<any>;
    updateCartItem(customerId: string, productId: string, dto: UpdateCartItemDto, tenantId: string): Promise<any>;
    removeFromCart(customerId: string, productId: string, tenantId: string): Promise<any>;
    clearCart(customerId: string, tenantId: string): Promise<any>;
    checkout(customerId: string, dto: CheckoutDto, tenantId: string): Promise<{
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
                price: Prisma.Decimal;
                compareAtPrice: Prisma.Decimal | null;
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
            price: Prisma.Decimal;
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
        total: Prisma.Decimal;
        subtotal: Prisma.Decimal | null;
        shippingTotal: Prisma.Decimal | null;
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
    private formatCart;
}
