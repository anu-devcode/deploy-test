import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString, IsObject } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class InitializePaymentDto {
    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @IsNotEmpty()
    orderId: string;

    @IsNumber()
    amount: number;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}

export class ConfirmPaymentDto {
    @IsNotEmpty()
    @IsString()
    transactionId: string;

    @IsOptional()
    @IsString()
    providerRef?: string;
}
