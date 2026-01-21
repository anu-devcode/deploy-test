import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InitializePaymentDto, ConfirmPaymentDto } from './dto';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

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

        // Mock payment initialization logic
        // In production, this would integrate with Telebirr/Chapa/etc APIs

        const payment = await this.prisma.payment.create({
            data: {
                orderId: dto.orderId,
                amount: dto.amount,
                method: dto.method,
                status: PaymentStatus.PENDING,
                metadata: dto.metadata || {},
            },
        });

        // Return mock payment URL or instructions
        return {
            paymentId: payment.id,
            paymentUrl: `https://mock-payment-gateway.com/pay/${payment.id}`,
            instructions: this.getPaymentInstructions(dto.method),
        };
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

    private getPaymentInstructions(method: PaymentMethod): string {
        switch (method) {
            case PaymentMethod.TELEBIRR:
                return 'Follow the Telebirr USSD prompt sent to your phone.';
            case PaymentMethod.CBE:
                return 'Transfer to CBE Account: 1000123456789. Use Order ID as reference.';
            case PaymentMethod.MPESA:
                return 'Enter your MPESA PIN to confirm transaction.';
            case PaymentMethod.CASH_ON_DELIVERY:
                return 'Pay cash upon delivery.';
            default:
                return 'Follow on-screen instructions.';
        }
    }
}
