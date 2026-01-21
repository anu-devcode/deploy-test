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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async initialize(dto, tenantId) {
        const order = await this.prisma.order.findFirst({
            where: { id: dto.orderId, tenantId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.status === client_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot pay for cancelled order');
        }
        const payment = await this.prisma.payment.create({
            data: {
                orderId: dto.orderId,
                amount: dto.amount,
                method: dto.method,
                status: client_1.PaymentStatus.PENDING,
                metadata: dto.metadata || {},
            },
        });
        return {
            paymentId: payment.id,
            paymentUrl: `https://mock-payment-gateway.com/pay/${payment.id}`,
            instructions: this.getPaymentInstructions(dto.method),
        };
    }
    async confirm(paymentId, dto, tenantId) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { order: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: client_1.PaymentStatus.COMPLETED,
                transactionId: dto.transactionId,
                providerRef: dto.providerRef,
            },
        });
        await this.prisma.order.update({
            where: { id: payment.orderId },
            data: {
                status: client_1.OrderStatus.CONFIRMED,
                paymentStatus: client_1.PaymentStatus.COMPLETED,
            },
        });
        return updatedPayment;
    }
    async getOrderPayments(orderId, tenantId) {
        return this.prisma.payment.findMany({
            where: {
                orderId,
                order: { tenantId },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    getPaymentInstructions(method) {
        switch (method) {
            case client_1.PaymentMethod.TELEBIRR:
                return 'Follow the Telebirr USSD prompt sent to your phone.';
            case client_1.PaymentMethod.CBE:
                return 'Transfer to CBE Account: 1000123456789. Use Order ID as reference.';
            case client_1.PaymentMethod.MPESA:
                return 'Enter your MPESA PIN to confirm transaction.';
            case client_1.PaymentMethod.CASH_ON_DELIVERY:
                return 'Pay cash upon delivery.';
            default:
                return 'Follow on-screen instructions.';
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map