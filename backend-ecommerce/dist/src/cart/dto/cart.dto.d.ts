export declare class AddToCartDto {
    productId: string;
    quantity: number;
}
export declare class UpdateCartItemDto {
    quantity: number;
}
export declare class CheckoutDto {
    shippingAddress: string;
    shippingCity: string;
    shippingCountry: string;
    paymentMethod: string;
}
