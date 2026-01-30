import { PaymentMethod } from '@prisma/client';
export declare class InitializePaymentDto {
    method: PaymentMethod;
    orderId: string;
    amount: number;
    metadata?: Record<string, any>;
}
export declare class ConfirmPaymentDto {
    transactionId: string;
    providerRef?: string;
}
