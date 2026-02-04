import { IsNotEmpty, IsNumber, IsArray, ValidateNested, IsUUID, Min, IsOptional, IsEmail, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
    @IsUUID()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    // For member checkout
    @IsOptional()
    @IsUUID()
    customerId?: string;

    // For guest checkout
    @IsOptional()
    @IsBoolean()
    isGuest?: boolean;

    @IsOptional()
    @IsEmail()
    guestEmail?: string;

    @IsOptional()
    @IsString()
    guestName?: string;

    @IsOptional()
    @IsString()
    guestPhone?: string;

    @IsOptional()
    @IsString()
    shippingAddress?: string;

    @IsOptional()
    @IsString()
    shippingCity?: string;

    @IsOptional()
    @IsString()
    paymentMethod?: string;

    @IsOptional()
    @IsBoolean()
    saveAddressToProfile?: boolean;

    @IsOptional()
    @IsUUID()
    savedPaymentMethodId?: string;

    @IsOptional()
    @IsBoolean()
    savePaymentMethodToProfile?: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsOptional()
    @IsString()
    promoCode?: string;

    @IsOptional()
    @IsNumber()
    discount?: number;
}
