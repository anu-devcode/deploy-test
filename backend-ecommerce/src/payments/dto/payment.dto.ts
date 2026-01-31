import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class InitializePaymentDto {
    @IsString()
    orderId: string;

    @IsNumber()
    amount: number;

    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @IsOptional()
    metadata?: any;
}

export class ConfirmPaymentDto {
    @IsString()
    @IsOptional()
    transactionId?: string;

    @IsString()
    @IsOptional()
    providerRef?: string;
}

export class SubmitManualPaymentDto {
    @IsString()
    receiptUrl: string;
}

export class VerifyManualPaymentDto {
    @IsBoolean()
    approve: boolean;

    @IsString()
    @IsOptional()
    note?: string;
}
