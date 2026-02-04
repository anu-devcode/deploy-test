import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InitializePaymentDto, ConfirmPaymentDto } from './dto';
import { PaymentMethod, PaymentStatus, OrderStatus, NotificationType } from '@prisma/client';
import { AutomationService } from '../automation/automation.service';
import { EventsGateway } from '../events/events.gateway';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
    constructor(
        private prisma: PrismaService,
        private automationService: AutomationService,
        private eventsGateway: EventsGateway,
        private emailService: EmailService,
        private notificationsService: NotificationsService,
    ) { }

    async initialize(dto: InitializePaymentDto) {
        const order = await this.prisma.order.findFirst({
            where: { id: dto.orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.status === OrderStatus.CANCELLED) {
            throw new BadRequestException('Cannot pay for cancelled order');
        }

        const payment = await this.prisma.payment.create({
            data: {
                orderId: dto.orderId,
                amount: dto.amount,
                method: dto.method,
                status: PaymentStatus.PENDING,
                metadata: dto.metadata || {},
            },
        });

        return {
            paymentId: payment.id,
            instructions: this.getPaymentInstructions(dto.method),
        };
    }

    async submitManual(paymentId: string, dto: any) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { order: true }
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        const updatedPayment = await this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: PaymentStatus.PROCESSING,
                receiptUrl: dto.receiptUrl,
            },
        });

        // Update order status to PENDING_VERIFICATION
        await this.prisma.order.update({
            where: { id: payment.orderId },
            data: { status: OrderStatus.PENDING_VERIFICATION },
        });

        // Emit WebSocket Event
        this.eventsGateway.notifyOrderStatusUpdate(payment.orderId, OrderStatus.PENDING_VERIFICATION);

        // Notify Admins for Manual Verification
        await this.notificationsService.create({
            type: 'FINANCE' as any,
            title: 'Manual Payment Submitted',
            message: `A new receipt has been uploaded for Order #${payment.order.orderNumber}.`,
            link: `/admin/orders/${payment.orderId}`,
            targetRole: 'ADMIN'
        });

        return updatedPayment;
    }

    async verify(paymentId: string, dto: any) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { order: { include: { customer: true } } },
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        if (dto.approve) {
            await this.prisma.payment.update({
                where: { id: paymentId },
                data: {
                    status: PaymentStatus.COMPLETED,
                    manualVerificationNote: dto.note,
                },
            });

            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: {
                    status: OrderStatus.CONFIRMED,
                    paymentStatus: PaymentStatus.COMPLETED,
                },
            });

            this.eventsGateway.notifyOrderStatusUpdate(payment.orderId, OrderStatus.CONFIRMED);

            // Send in-app notification for payment success
            if (payment.order.customerId) {
                await this.notificationsService.create({
                    customerId: payment.order.customerId,
                    type: 'PAYMENT_RECEIVED' as any,
                    title: 'Payment Successful',
                    message: `Your payment for order ${payment.order.orderNumber} has been successfully verified.`,
                    link: `/account/orders/${payment.orderId}`
                });
            }
        } else {
            await this.prisma.payment.update({
                where: { id: paymentId },
                data: {
                    status: PaymentStatus.FAILED,
                    manualVerificationNote: dto.note,
                },
            });

            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: {
                    status: OrderStatus.PENDING, // Go back to pending if rejected
                    paymentStatus: PaymentStatus.FAILED,
                },
            });

            this.eventsGateway.notifyOrderStatusUpdate(payment.orderId, OrderStatus.PENDING);

            // Send email and in-app notification for payment failure
            const isGuest = payment.order.isGuest;
            const recipientEmail = isGuest ? payment.order.guestEmail : payment.order.customer?.email;
            const recipientName = isGuest ? payment.order.guestName : 'Customer';

            if (recipientEmail) {
                this.emailService.sendPaymentFailed(
                    recipientEmail,
                    recipientName || 'Customer',
                    payment.order.orderNumber || 'UNKNOWN',
                    dto.note || 'Manual verification failed'
                );
            }

            if (payment.order.customerId) {
                await this.notificationsService.create({
                    customerId: payment.order.customerId,
                    type: 'PAYMENT_RECEIVED' as any,
                    title: 'Payment Failed',
                    message: `Your payment verification for order ${payment.order.orderNumber} failed: ${dto.note || 'Review details'}.`,
                    link: `/account/orders/${payment.orderId}`
                });
            }

            // Notify Finance Staff of verification failure
            await this.notificationsService.create({
                type: 'FINANCE' as any,
                title: 'Payment Verification Failed',
                message: `Payment for Order #${payment.order.orderNumber} was rejected by ${dto.staffId || 'Admin'}.`,
                link: `/admin/orders/${payment.orderId}`,
                targetRole: 'ADMIN'
            });
        }

        return { success: true };
    }

    async confirm(paymentId: string, dto: ConfirmPaymentDto) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { order: { include: { customer: true } } },
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        // Update payment status
        const updatedPayment = await this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: PaymentStatus.COMPLETED,
                transactionId: dto.transactionId,
                providerRef: dto.providerRef,
            },
        });

        // Update order status
        await this.prisma.order.update({
            where: { id: payment.orderId },
            data: {
                status: OrderStatus.CONFIRMED,
                paymentStatus: PaymentStatus.COMPLETED,
            },
        });

        // Trigger Automation
        await this.automationService.trigger('PAYMENT_RECEIVED', updatedPayment);

        // Emit WebSocket Event
        this.eventsGateway.notifyOrderStatusUpdate(payment.orderId, OrderStatus.CONFIRMED);

        return updatedPayment;
    }

    async getOrderPayments(orderId: string) {
        return this.prisma.payment.findMany({
            where: {
                orderId,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findAll() {
        return this.prisma.payment.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    private getPaymentInstructions(method: PaymentMethod): any {
        switch (method) {
            case PaymentMethod.TELEBIRR:
                return {
                    name: 'Telebirr SuperApp',
                    accountName: 'Adis Harvest Global',
                    accountNumber: '+251912345678',
                    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=telebirr://pay?to=0912345678',
                    type: 'phone'
                };
            case PaymentMethod.CBE:
                return {
                    name: 'Commercial Bank of Ethiopia',
                    accountName: 'Adis Harvest PLC',
                    accountNumber: '1000123456789',
                    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=cbe:1000123456789',
                    type: 'account'
                };
            case PaymentMethod.CASH_ON_DELIVERY:
                return {
                    name: 'Cash on Delivery',
                    instructions: 'Pay cash upon delivery.'
                };
            case PaymentMethod.ONLINE:
                return {
                    name: 'Online Payment',
                    instructions: 'Coming Soon - Integration in progress.'
                };
            default:
                return {
                    instructions: 'Follow on-screen instructions.'
                };
        }
    }
}
