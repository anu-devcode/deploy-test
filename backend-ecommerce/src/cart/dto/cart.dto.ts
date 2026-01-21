import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class AddToCartDto {
    @IsUUID()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class UpdateCartItemDto {
    @IsNumber()
    @Min(0)
    quantity: number;
}

export class CheckoutDto {
    @IsNotEmpty()
    shippingAddress: string;

    @IsNotEmpty()
    shippingCity: string;

    @IsNotEmpty()
    shippingCountry: string;

    @IsNotEmpty()
    paymentMethod: string;
}
