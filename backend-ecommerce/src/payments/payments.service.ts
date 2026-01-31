import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InitializePaymentDto, ConfirmPaymentDto } from './dto';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';
import { AutomationService } from '../automation/automation.service';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class PaymentsService {
    constructor(
        private prisma: PrismaService,
        private automationService: AutomationService,
        private eventsGateway: EventsGateway
    ) { }

    async initialize(dto: InitializePaymentDto, tenantId: string) {
        const order = await this.prisma.order.findFirst({
            where: { id: dto.orderId, tenantId },
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

    async submitManual(paymentId: string, dto: any, tenantId: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { order: true }
        });

        if (!payment || payment.order.tenantId !== tenantId) {
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
        this.eventsGateway.notifyOrderStatusUpdate(tenantId, payment.orderId, OrderStatus.PENDING_VERIFICATION);

        return updatedPayment;
    }

    async verify(paymentId: string, dto: any, tenantId: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { order: true },
        });

        if (!payment || payment.order.tenantId !== tenantId) {
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

            this.eventsGateway.notifyOrderStatusUpdate(tenantId, payment.orderId, OrderStatus.CONFIRMED);
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

            this.eventsGateway.notifyOrderStatusUpdate(tenantId, payment.orderId, OrderStatus.PENDING);
        }

        return { success: true };
    }

    async confirm(paymentId: string, dto: ConfirmPaymentDto, tenantId: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { order: true },
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
        await this.automationService.trigger('PAYMENT_RECEIVED', updatedPayment, tenantId);

        // Emit WebSocket Event
        this.eventsGateway.notifyOrderStatusUpdate(tenantId, payment.orderId, OrderStatus.CONFIRMED);

        return updatedPayment;
    }

    async getOrderPayments(orderId: string, tenantId: string) {
        return this.prisma.payment.findMany({
            where: {
                orderId,
                order: { tenantId },
            },
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
