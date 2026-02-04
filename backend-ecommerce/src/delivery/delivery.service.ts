import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto, UpdateDeliveryDto } from './dto';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../email/email.service';
import { DeliveryStatus, OrderStatus, NotificationType } from '@prisma/client';

@Injectable()
export class DeliveryService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notifications: NotificationsService,
        private readonly emailService: EmailService,
    ) { }

    async create(dto: CreateDeliveryDto) {
        // Verify order exists
        const order = await this.prisma.order.findFirst({
            where: { id: dto.orderId },
        });
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const delivery = await this.prisma.delivery.create({
            data: {
                orderId: dto.orderId,
                driverName: dto.driverName,
                driverPhone: dto.driverPhone,
                vehicleInfo: dto.vehicleInfo,
                estimatedTime: dto.estimatedTime ? new Date(dto.estimatedTime) : undefined,
                notes: dto.notes,
            },
            include: { order: { include: { customer: true } } },
        });

        // Update order status to SHIPPED if it was CONFIRMED or PROCESSING
        if (order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.PROCESSING) {
            await this.prisma.order.update({
                where: { id: order.id },
                data: { status: OrderStatus.SHIPPED },
            });
        }

        return delivery;
    }

    async findAll() {
        return this.prisma.delivery.findMany({
            include: { order: { include: { customer: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const delivery = await this.prisma.delivery.findFirst({
            where: { id },
            include: { order: { include: { customer: true, items: { include: { product: true } } } } },
        });
        if (!delivery) {
            throw new NotFoundException('Delivery not found');
        }
        return delivery;
    }

    async findByOrder(orderId: string) {
        return this.prisma.delivery.findFirst({
            where: { orderId },
            include: { order: true },
        });
    }

    async update(id: string, dto: UpdateDeliveryDto) {
        await this.findOne(id);

        const updatedDelivery = await this.prisma.delivery.update({
            where: { id },
            data: {
                status: dto.status as DeliveryStatus,
                driverName: dto.driverName,
                driverPhone: dto.driverPhone,
                vehicleInfo: dto.vehicleInfo,
                estimatedTime: dto.estimatedTime ? new Date(dto.estimatedTime) : undefined,
                actualDelivery: dto.actualDelivery ? new Date(dto.actualDelivery) : undefined,
                notes: dto.notes,
            },
            include: { order: { include: { customer: true } } },
        });

        if (dto.status) {
            await this.handleStatusChange(updatedDelivery);
        }

        return updatedDelivery;
    }

    async updateStatus(id: string, status: string) {
        const delivery = await this.findOne(id);

        const data: any = { status: status as DeliveryStatus };
        if (status === 'DELIVERED') {
            data.actualDelivery = new Date();
        }

        const updatedDelivery = await this.prisma.delivery.update({
            where: { id },
            data,
            include: { order: { include: { customer: true } } },
        });

        await this.handleStatusChange(updatedDelivery);

        return updatedDelivery;
    }

    private async handleStatusChange(delivery: any) {
        const status = delivery.status;
        const orderId = delivery.orderId;
        const customerId = delivery.order?.customerId;

        // Map DeliveryStatus to OrderStatus
        let orderStatus: OrderStatus | null = null;
        let notificationTitle = '';
        let notificationMessage = '';

        switch (status) {
            case DeliveryStatus.ASSIGNED:
            case DeliveryStatus.PICKED_UP:
            case DeliveryStatus.IN_TRANSIT:
                orderStatus = OrderStatus.SHIPPED;
                notificationTitle = 'Order Shipped';
                notificationMessage = `Your order #${delivery.order?.orderNumber} is now ${status.toLowerCase().replace('_', ' ')}.`;
                break;
            case DeliveryStatus.DELIVERED:
                orderStatus = OrderStatus.DELIVERED;
                notificationTitle = 'Order Delivered';
                notificationMessage = `Your order #${delivery.order?.orderNumber} has been delivered successfully!`;
                break;
            case DeliveryStatus.FAILED:
                // We typically don't cancel orders automatically on delivery failure, 
                // but we notify the customer.
                notificationTitle = 'Delivery Attempt Failed';
                notificationMessage = `We couldn't deliver your order #${delivery.order?.orderNumber}. Please contact support.`;
                break;
            case DeliveryStatus.COURIER_MISSED:
                notificationTitle = 'Courier Pickup Missed';
                notificationMessage = `The courier missed the pickup for order #${delivery.order?.orderNumber}. Please reschedule.`;
                // Alert Logistics Admin
                await this.notifications.create({
                    type: 'LOGISTICS' as any,
                    title: 'Courier Pickup Missed',
                    message: `Delivery #${delivery.id.slice(0, 8)} for Order #${delivery.order?.orderNumber} was not picked up.`,
                    link: `/admin/deliveries/${delivery.id}`,
                    targetRole: 'ADMIN'
                });
                break;
        }

        if (orderStatus) {
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: orderStatus },
            });
        }

        if (customerId && notificationTitle) {
            await this.notifications.create({
                customerId,
                type: NotificationType.DELIVERY,
                title: notificationTitle,
                message: notificationMessage,
                link: `/profile/orders/${orderId}`,
            });
        }

        // Send Email Update
        const order = delivery.order;
        const customerEmail = order.customer?.email || order.guestEmail;
        const customerName = order.customer?.firstName || order.guestName || 'Customer';

        if (customerEmail && notificationTitle) {
            await this.emailService.sendOrderStatusUpdate(
                customerEmail,
                order.orderNumber,
                status.toLowerCase().replace('_', ' '),
                customerName,
                delivery.trackingNumber || delivery.id.slice(0, 8),
                order.isGuest
            );
        }
    }
}
