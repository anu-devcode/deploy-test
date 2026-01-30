import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, CheckoutDto } from './dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(customerId: string, tenantId: string): Promise<any>;
    addToCart(customerId: string, dto: AddToCartDto, tenantId: string): Promise<any>;
    updateCartItem(customerId: string, productId: string, dto: UpdateCartItemDto, tenantId: string): Promise<any>;
    removeFromCart(customerId: string, productId: string, tenantId: string): Promise<any>;
    clearCart(customerId: string, tenantId: string): Promise<any>;
    checkout(customerId: string, dto: CheckoutDto, tenantId: string): Promise<{
        customer: {
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            adminNotes: string | null;
            flags: string[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
        };
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tenantId: string;
                name: string;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
                compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
                stock: number;
                sku: string | null;
                images: string[];
                tags: string[];
                isPublished: boolean;
                isFeatured: boolean;
                retailEnabled: boolean;
                retailPrice: import("@prisma/client-runtime-utils").Decimal | null;
                retailUnit: string | null;
                retailMinOrder: number | null;
                bulkEnabled: boolean;
                bulkPrice: import("@prisma/client-runtime-utils").Decimal | null;
                bulkUnit: string | null;
                bulkMinOrder: number | null;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
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
