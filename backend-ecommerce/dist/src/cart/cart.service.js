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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const Decimal = client_1.Prisma.Decimal;
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(customerId, tenantId) {
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
    async addToCart(customerId, dto, tenantId) {
        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId, tenantId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.stock < dto.quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        let cart = await this.prisma.cart.findUnique({
            where: { customerId },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { customerId, tenantId },
            });
        }
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: dto.productId,
                },
            },
        });
        if (existingItem) {
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + dto.quantity },
            });
        }
        else {
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
    async updateCartItem(customerId, productId, dto, tenantId) {
        const cart = await this.prisma.cart.findUnique({
            where: { customerId },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
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
            throw new common_1.NotFoundException('Item not in cart');
        }
        if (dto.quantity === 0) {
            await this.prisma.cartItem.delete({ where: { id: cartItem.id } });
        }
        else {
            await this.prisma.cartItem.update({
                where: { id: cartItem.id },
                data: { quantity: dto.quantity },
            });
        }
        return this.getOrCreateCart(customerId, tenantId);
    }
    async removeFromCart(customerId, productId, tenantId) {
        const cart = await this.prisma.cart.findUnique({
            where: { customerId },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        await this.prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                productId,
            },
        });
        return this.getOrCreateCart(customerId, tenantId);
    }
    async clearCart(customerId, tenantId) {
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
    async checkout(customerId, dto, tenantId) {
        const cart = await this.prisma.cart.findUnique({
            where: { customerId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${item.product.name}`);
            }
        }
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
        const orderCount = await this.prisma.order.count({ where: { tenantId } });
        const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;
        const order = await this.prisma.$transaction(async (tx) => {
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
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            return newOrder;
        });
        return order;
    }
    formatCart(cart) {
        const items = cart.items || [];
        let subtotal = new Decimal(0);
        const formattedItems = items.map((item) => {
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
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: subtotal.toNumber(),
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map