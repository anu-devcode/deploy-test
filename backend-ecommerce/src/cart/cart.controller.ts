import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, CheckoutDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get(':customerId')
    getCart(@Param('customerId') customerId: string) {
        return this.cartService.getOrCreateCart(customerId);
    }

    @Post(':customerId/items')
    addToCart(
        @Param('customerId') customerId: string,
        @Body() dto: AddToCartDto,
    ) {
        return this.cartService.addToCart(customerId, dto);
    }

    @Patch(':customerId/items/:productId')
    updateCartItem(
        @Param('customerId') customerId: string,
        @Param('productId') productId: string,
        @Body() dto: UpdateCartItemDto,
    ) {
        return this.cartService.updateCartItem(customerId, productId, dto);
    }

    @Delete(':customerId/items/:productId')
    removeFromCart(
        @Param('customerId') customerId: string,
        @Param('productId') productId: string,
    ) {
        return this.cartService.removeFromCart(customerId, productId);
    }

    @Delete(':customerId')
    clearCart(@Param('customerId') customerId: string) {
        return this.cartService.clearCart(customerId);
    }

    @Post(':customerId/checkout')
    checkout(
        @Param('customerId') customerId: string,
        @Body() dto: CheckoutDto,
    ) {
        return this.cartService.checkout(customerId, dto);
    }
}
