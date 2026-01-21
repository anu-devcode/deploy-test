import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto, CheckoutDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async getOrCreateCart(customerId: string, tenantId: string) {
        let cart = await this.prisma.cart.findUnique({
            where: { customerId },
            include: {
                items: {
                    include: { product: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    customerId,
                    tenantId,
                },
                include: {
                    items: {
                        include: { product: true },
                    },
                },
            });
        }

        return this.formatCart(cart);
    }

    async addToCart(customerId: string, dto: AddToCartDto, tenantId: string) {
        // Verify product exists and belongs to tenant
        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId, tenantId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.stock < dto.quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        // Get or create cart
        let cart = await this.prisma.cart.findUnique({
            where: { customerId },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { customerId, tenantId },
            });
        }

        // Check if item already in cart
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: dto.productId,
                },
            },
        });

        if (existingItem) {
            // Update quantity
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + dto.quantity },
            });
        } else {
            // Add new item
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: dto.productId,
                    quantity: dto.quantity,
                },
            });
        }

        return this.getOrCreateCart(customerId, tenantId);
    }

    async updateCartItem(
        customerId: string,
        productId: string,
        dto: UpdateCartItemDto,
        tenantId: string,
    ) {
        const cart = await this.prisma.cart.findUnique({
            where: { customerId },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const cartItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        if (!cartItem) {
            throw new NotFoundException('Item not in cart');
        }

        if (dto.quantity === 0) {
            // Remove item
            await this.prisma.cartItem.delete({ where: { id: cartItem.id } });
        } else {
            // Update quantity
            await this.prisma.cartItem.update({
                where: { id: cartItem.id },
                data: { quantity: dto.quantity },
            });
        }

        return this.getOrCreateCart(customerId, tenantId);
    }

    async removeFromCart(customerId: string, productId: string, tenantId: string) {
        const cart = await this.prisma.cart.findUnique({
            where: { customerId },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        await this.prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                productId,
            },
        });

        return this.getOrCreateCart(customerId, tenantId);
    }

    async clearCart(customerId: string, tenantId: string) {
        const cart = await this.prisma.cart.findUnique({
            where: { customerId },
        });

        if (cart) {
            await this.prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }

        return this.getOrCreateCart(customerId, tenantId);
    }

    async checkout(customerId: string, dto: CheckoutDto, tenantId: string) {
        const cart = await this.prisma.cart.findUnique({
            where: { customerId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        // Validate stock for all items
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                throw new BadRequestException(`Insufficient stock for ${item.product.name}`);
            }
        }

        // Calculate total
        let total = new Decimal(0);
        const orderItems = cart.items.map((item) => {
            const itemTotal = item.product.price.mul(item.quantity);
            total = total.add(itemTotal);
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
            };
        });

        // Generate order number
        const orderCount = await this.prisma.order.count({ where: { tenantId } });
        const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

        // Create order in transaction
        const order = await this.prisma.$transaction(async (tx) => {
            // Create order
            const newOrder = await tx.order.create({
                data: {
                    orderNumber,
                    customerId,
                    tenantId,
                    total,
                    shippingAddress: dto.shippingAddress,
                    shippingCity: dto.shippingCity,
                    shippingCountry: dto.shippingCountry,
                    paymentMethod: dto.paymentMethod,
                    items: {
                        create: orderItems,
                    },
                },
                include: {
                    items: {
                        include: { product: true },
                    },
                    customer: true,
                },
            });

            // Reduce stock
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Clear cart
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });

            return newOrder;
        });

        return order;
    }

    private formatCart(cart: any) {
        const items = cart.items || [];
        let subtotal = new Decimal(0);

        const formattedItems = items.map((item: any) => {
            const itemTotal = item.product.price.mul(item.quantity);
            subtotal = subtotal.add(itemTotal);
            return {
                ...item,
                itemTotal: itemTotal.toNumber(),
            };
        });

        return {
            ...cart,
            items: formattedItems,
            itemCount: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
            subtotal: subtotal.toNumber(),
        };
    }
}
