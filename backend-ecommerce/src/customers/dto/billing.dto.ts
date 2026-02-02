import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class AddPaymentMethodDto {
    @IsEnum(PaymentMethod)
    type: PaymentMethod;

    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @IsString()
    last4?: string;

    @IsOptional()
    @IsString()
    expiry?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    accountNumber?: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}
