import { PrismaService } from '../prisma/prisma.service';
import { InitializePaymentDto, ConfirmPaymentDto } from './dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    initialize(dto: InitializePaymentDto, tenantId: string): Promise<{
        paymentId: string;
        paymentUrl: string;
        instructions: string;
    }>;
    confirm(paymentId: string, dto: ConfirmPaymentDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        orderId: string;
        method: import("@prisma/client").$Enums.PaymentMethod;
        amount: import("@prisma/client-runtime-utils").Decimal;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        transactionId: string | null;
        providerRef: string | null;
    }>;
    getOrderPayments(orderId: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        orderId: string;
        method: import("@prisma/client").$Enums.PaymentMethod;
        amount: import("@prisma/client-runtime-utils").Decimal;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        transactionId: string | null;
        providerRef: string | null;
    }[]>;
    private getPaymentInstructions;
}
