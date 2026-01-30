import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto';
import { OrderStatus, Prisma } from '@prisma/client';
import { AutomationService } from '../automation/automation.service';
import { randomBytes } from 'crypto';

const Decimal = Prisma.Decimal;

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private automationService: AutomationService
    ) { }

    private generateTrackingToken(): string {
        return randomBytes(16).toString('hex');
    }

    private generateOrderNumber(): string {
        const prefix = 'AH'; // Adis Harvest
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = randomBytes(2).toString('hex').toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }

    async create(dto: CreateOrderDto, tenantId: string) {
        // Validate: must have either customerId or guest info
        if (!dto.customerId && !dto.isGuest) {
            throw new BadRequestException('Either customerId or guest checkout is required');
        }

        if (dto.isGuest && (!dto.guestEmail || !dto.guestName)) {
            throw new BadRequestException('Guest checkout requires email and name');
        }

        // Fetch products and validate
        const productIds = dto.items.map((item) => item.productId);
        const products = await this.prisma.product.findMany({
            where: {
                id: { in: productIds },
                tenantId,
            },
        });

        if (products.length !== productIds.length) {
            throw new BadRequestException('One or more products not found');
        }

        // Calculate total
        let total = new Decimal(0);
        const orderItems = dto.items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) throw new BadRequestException('Product not found');
            const itemTotal = product.price.mul(item.quantity);
            total = total.add(itemTotal);
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            };
        });

        // Generate tracking token for guest orders
        const trackingToken = dto.isGuest ? this.generateTrackingToken() : null;
        const orderNumber = this.generateOrderNumber();

        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                tenantId,
                total,
                subtotal: total,
                // Guest checkout fields
                isGuest: dto.isGuest || false,
                guestEmail: dto.guestEmail,
                guestName: dto.guestName,
                guestPhone: dto.guestPhone,
                trackingToken,
                // Shipping info
                shippingAddress: dto.shippingAddress,
                shippingCity: dto.shippingCity,
                paymentMethod: dto.paymentMethod,
                // Customer (optional for guests)
                customerId: dto.customerId || null,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
            },
        });

        // Trigger Automation
        await this.automationService.trigger('ORDER_CREATED', order, tenantId);

        return order;
    }

    async findAll(tenantId: string) {
        return this.prisma.order.findMany({
            where: { tenantId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, tenantId: string) {
        const order = await this.prisma.order.findFirst({
            where: { id, tenantId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    /**
     * Track order by Order ID + Email (for guests)
     */
    async trackByEmail(orderNumber: string, email: string) {
        const order = await this.prisma.order.findFirst({
            where: {
                orderNumber,
                guestEmail: email,
                isGuest: true,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found. Please check your order number and email.');
        }

        // Return limited info for security
        return {
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            total: order.total,
            shippingAddress: order.shippingAddress,
            shippingCity: order.shippingCity,
            trackingNumber: order.trackingNumber,
            items: order.items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
            })),
            createdAt: order.createdAt,
        };
    }

    /**
     * Track order by tracking token (unique link)
     */
    async trackByToken(trackingToken: string) {
        const order = await this.prisma.order.findFirst({
            where: { trackingToken },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Invalid tracking link');
        }

        return {
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            total: order.total,
            guestName: order.guestName,
            shippingAddress: order.shippingAddress,
            shippingCity: order.shippingCity,
            trackingNumber: order.trackingNumber,
            items: order.items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
            })),
            createdAt: order.createdAt,
        };
    }

    async updateStatus(id: string, status: OrderStatus, tenantId: string) {
        await this.findOne(id, tenantId);
        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId);
        // First delete order items
        await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
        return this.prisma.order.delete({ where: { id } });
    }
}
