import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto';
import { OrderStatus, Prisma } from '@prisma/client';
import { AutomationService } from '../automation/automation.service';
import { EventsGateway } from '../events/events.gateway';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PromotionsService } from '../promotions/promotions.service';
import { PromoBusinessType } from '@prisma/client';

const Decimal = Prisma.Decimal;

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private automationService: AutomationService,
        private eventsGateway: EventsGateway,
        private emailService: EmailService,
        private notificationsService: NotificationsService,
        private promotionsService: PromotionsService,
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

    async create(dto: CreateOrderDto) {
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

        let subtotalAccumulator = total;
        let finalDiscount = new Decimal(0);
        let promoId = null;

        // Apply Promotion if present
        if (dto.promoCode) {
            try {
                // Determine user's business type for evaluation
                let businessType: PromoBusinessType = 'RETAIL';
                if (dto.customerId) {
                    const customer = await this.prisma.customer.findUnique({ where: { id: dto.customerId } });
                    if (customer?.flags.includes('BULK_CUSTOMER')) businessType = 'BULK';
                }

                const evalResult = await this.promotionsService.evaluate({
                    code: dto.promoCode,
                    items: orderItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: Number(item.price),
                        // Note: For evaluation we need categoryId. Let's fetch it from products.
                        categoryId: products.find(p => p.id === item.productId)?.categoryId || ''
                    })),
                    businessType
                });

                finalDiscount = new Decimal(evalResult.totalDiscount);
                total = total.sub(finalDiscount);
                if (total.lt(0)) total = new Decimal(0);
                promoId = evalResult.promoId;
            } catch (error) {
                // If promo is invalid, we could either throw or proceed without it.
                // Best to throw for explicit code application.
                throw new BadRequestException(`Promotion error: ${error.message}`);
            }
        }

        // Generate tracking token for guest orders
        const trackingToken = dto.isGuest ? this.generateTrackingToken() : null;
        const orderNumber = this.generateOrderNumber();

        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                total,
                subtotal: subtotalAccumulator,
                discount: finalDiscount,
                promoCode: dto.promoCode,
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
        // 1.5 Sync Profile if requested
        if (dto.customerId) {
            if (dto.saveAddressToProfile) {
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
                        firstName: firstName || undefined,
                        lastName: lastName || undefined,
                        phone: dto.guestPhone || undefined,
                    }
                });
            }

            if (dto.savePaymentMethodToProfile && dto.paymentMethod) {
                // Check if this method already saved (simple check by type and brand/last4)
                const existing = await this.prisma.savedPaymentMethod.findFirst({
                    where: {
                        customerId: dto.customerId,
                        type: dto.paymentMethod as any,
                        // Add more specific checks if available in dto
                    }
                });

                if (!existing) {
                    await this.prisma.savedPaymentMethod.create({
                        data: {
                            customerId: dto.customerId,
                            type: dto.paymentMethod as any,
                            isDefault: true, // Make newly saved method default
                        }
                    });
                }
            }
        }

        // Trigger Automation
        await this.automationService.trigger('ORDER_CREATED', order);

        // Emit WebSocket Event
        this.eventsGateway.notifyNewOrder(order);

        // Send order confirmation email
        const recipientEmail = dto.isGuest ? dto.guestEmail : order.customer?.email;
        const recipientName = dto.isGuest ? dto.guestName : [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(' ');

        if (recipientEmail) {
            const orderItems = order.items.map((item: any) => ({
                name: item.product?.name || 'Product',
                quantity: item.quantity,
                price: Number(item.price) * item.quantity,
            }));

            await this.emailService.sendOrderConfirmation(
                recipientEmail,
                {
                    orderNumber: order.orderNumber || 'UNKNOWN',
                    total: Number(order.total),
                    items: orderItems,
                },
                recipientName || 'Customer',
                dto.isGuest || false,
            );
        }

        // Send in-app notification if customerId exists
        if (order.customerId) {
            await this.notificationsService.create({
                customerId: order.customerId,
                type: 'ORDER_STATUS' as any,
                title: 'Order Placed successfully',
                message: `Thank you for your order! Your order ${order.orderNumber} has been received.`,
                link: `/account/orders/${order.id}`
            });

            // If manual payment method, add pending payment alert
            if (['CBE', 'BANK_TRANSFER', 'TELEBIRR', 'MPESA'].includes(order.paymentMethod || '')) {
                await this.notificationsService.create({
                    customerId: order.customerId,
                    type: 'ORDER_STATUS' as any,
                    title: 'Order pending payment',
                    message: `Please complete the payment for order ${order.orderNumber} to proceed.`,
                    link: `/account/orders/${order.id}`
                });
            }
        }

        // Record usage if promo was used
        if (promoId) {
            await this.promotionsService.recordUsage(promoId);
        }

        return order;
    }

    async findAll() {
        return this.prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                payments: true,
                delivery: true,
                delivery: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const order = await this.prisma.order.findFirst({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                payments: true,
                delivery: true,
                delivery: true,
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
                delivery: true,
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
            delivery: (order as any).delivery,
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

    async updateStatus(id: string, status: OrderStatus) {
        const existingOrder = await this.findOne(id);
        const order = await this.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                customer: true,
            },
        });

        // Emit WebSocket Event
        this.eventsGateway.notifyOrderStatusUpdate(id, status);

        // Send status update email
        const isGuest = (order as any).isGuest;
        const recipientEmail = isGuest ? (order as any).guestEmail : (order as any).customer?.email;
        const recipientName = isGuest
            ? (order as any).guestName
            : [(order as any).customer?.firstName, (order as any).customer?.lastName].filter(Boolean).join(' ');

        if (recipientEmail) {
            const statusLabel = this.getStatusLabel(status);
            const trackingInfo = (order as any).trackingNumber || undefined;

            await this.emailService.sendOrderStatusUpdate(
                recipientEmail,
                (order as any).orderNumber,
                statusLabel,
                recipientName || 'Customer',
                trackingInfo,
                isGuest,
            );
        }

        // Send in-app notification if customerId exists
        if (order.customerId) {
            const statusLabel = this.getStatusLabel(status);
            let nType: any = 'ORDER_STATUS';
            let title = statusLabel;
            let message = `Your order ${order.orderNumber} status has been updated to ${statusLabel}.`;

            if (status === 'SHIPPED' || status === 'DELIVERED') {
                nType = 'DELIVERY';
            }

            await this.notificationsService.create({
                customerId: order.customerId,
                type: nType,
                title,
                message,
                link: `/account/orders/${order.id}`
            });
        }

        return order;
    }

    async cancelOrder(id: string, reason: string, userId: string, isAdmin: boolean = false) {
        const order = await this.findOne(id);

        if (order.status === 'CANCELLED') {
            throw new BadRequestException('Order is already cancelled');
        }

        if (order.status === 'DELIVERED' || order.status === 'SHIPPED') {
            throw new BadRequestException('Cannot cancel order in current status');
        }

        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: {
                status: OrderStatus.CANCELLED,
                notes: order.notes ? `${order.notes}\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`
            },
            include: { customer: true }
        });

        // Notify Admin
        await this.notificationsService.create({
            type: 'ORDER_STATUS' as any,
            title: `Order Cancelled by ${isAdmin ? 'Admin' : 'Customer'}`,
            message: `Order #${order.orderNumber} has been cancelled. Reason: ${reason}`,
            link: `/admin/orders/${order.id}`,
            targetRole: 'ADMIN' // Target all admins
        });

        // Notify Customer (if not initiated by them, or even if it is, for confirmation)
        if (order.customerId) {
            await this.notificationsService.create({
                customerId: order.customerId,
                type: 'ORDER_STATUS' as any,
                title: 'Order Cancelled',
                message: `Your order #${order.orderNumber} has been cancelled.`,
                link: `/account/orders/${order.id}`
            });
        }

        // Send Email
        const recipientEmail = order.isGuest ? order.guestEmail : order.customer?.email;
        if (recipientEmail) {
            await this.emailService.sendOrderStatusUpdate(
                recipientEmail,
                order.orderNumber || 'UNKNOWN',
                'Order Cancelled',
                order.isGuest ? (order.guestName || 'Customer') : (order.customer?.firstName || 'Customer'),
                undefined,
                order.isGuest
            );
        }

        return updatedOrder;
    }

    private getStatusLabel(status: OrderStatus): string {
        const labels: Record<OrderStatus, string> = {
            PENDING: 'Order Pending',
            PENDING_VERIFICATION: 'Awaiting Payment Verification',
            CONFIRMED: 'Order Confirmed',
            PROCESSING: 'Order Processing',
            PACKED: 'Order Packed',
            SHIPPED: 'Order Shipped',
            DELIVERED: 'Order Delivered',
            CANCELLED: 'Order Cancelled',
        };
        return labels[status] || status;
    }

    async remove(id: string) {
        await this.findOne(id);
        // First delete order items
        await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
        return this.prisma.order.delete({ where: { id } });
    }
}
