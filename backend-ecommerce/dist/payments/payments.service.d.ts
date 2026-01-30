import { PrismaService } from '../prisma/prisma.service';
import { InitializePaymentDto, ConfirmPaymentDto } from './dto';
import { AutomationService } from '../automation/automation.service';
export declare class PaymentsService {
    private prisma;
    private automationService;
    constructor(prisma: PrismaService, automationService: AutomationService);
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
        method: import("@prisma/client").$Enums.PaymentMethod;
        orderId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        providerRef: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    getOrderPayments(orderId: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        method: import("@prisma/client").$Enums.PaymentMethod;
        orderId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        providerRef: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    private getPaymentInstructions;
}
