import { PaymentsService } from './payments.service';
import { InitializePaymentDto, ConfirmPaymentDto } from './dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    initialize(dto: InitializePaymentDto, tenantId: string): Promise<{
        paymentId: string;
        paymentUrl: string;
        instructions: string;
    }>;
    confirm(id: string, dto: ConfirmPaymentDto, tenantId: string): Promise<{
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
}
