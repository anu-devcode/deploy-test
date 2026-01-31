import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto';
import { OrderStatus, Prisma } from '@prisma/client';
import { AutomationService } from '../automation/automation.service';
import { EventsGateway } from '../events/events.gateway';
import { randomBytes } from 'crypto';

const Decimal = Prisma.Decimal;

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private automationService: AutomationService,
        private eventsGateway: EventsGateway
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
                customerId: dto.customerId || undefined,
                items: {
                    create: orderItems,
                },
            } as any,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
            },
        });

        // 1.5 Sync Profile if requested
        if (dto.saveAddressToProfile && dto.customerId) {
            let firstName: string | undefined;
            let lastName: string | undefined;

            if (dto.guestName) {
                const parts = dto.guestName.trim().split(/\s+/);
                firstName = parts[0];
                lastName = parts.slice(1).join(' ') || '';
            }

            await this.prisma.customer.update({
                where: { id: dto.customerId },
                data: {
                    firstName,
                    lastName,
                    phone: dto.guestPhone, // Use guest phone as it's the most recent
                    address: dto.shippingAddress,
                    city: dto.shippingCity,
                }
            });
        }

        // Trigger Automation
        await this.automationService.trigger('ORDER_CREATED', order, tenantId);

        // Emit WebSocket Event
        this.eventsGateway.notifyNewOrder(tenantId, order);

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
            orderNumber: (order as any).orderNumber,
            status: (order as any).status,
            paymentStatus: (order as any).paymentStatus,
            total: (order as any).total,
            shippingAddress: (order as any).shippingAddress,
            shippingCity: (order as any).shippingCity,
            trackingNumber: (order as any).trackingNumber,
            items: (order as any).items.map((item: any) => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
            })),
            createdAt: (order as any).createdAt,
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
            orderNumber: (order as any).orderNumber,
            status: (order as any).status,
            paymentStatus: (order as any).paymentStatus,
            total: (order as any).total,
            guestName: (order as any).guestName,
            shippingAddress: (order as any).shippingAddress,
            shippingCity: (order as any).shippingCity,
            trackingNumber: (order as any).trackingNumber,
            items: (order as any).items.map((item: any) => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
            })),
            createdAt: (order as any).createdAt,
        };
    }

    async updateStatus(id: string, status: OrderStatus, tenantId: string) {
        await this.findOne(id, tenantId);
        const order = await this.prisma.order.update({
            where: { id },
            data: { status },
        });

        // Emit WebSocket Event
        this.eventsGateway.notifyOrderStatusUpdate(tenantId, id, status);

        return order;
    }

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId);
        // First delete order items
        await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
        return this.prisma.order.delete({ where: { id } });
    }
}
