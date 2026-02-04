import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, CheckoutDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    getCart(@CurrentUser() user: any) {
        return this.cartService.getOrCreateCart(user.id);
    }

    @Post('items')
    addToCart(
        @CurrentUser() user: any,
        @Body() dto: AddToCartDto,
    ) {
        return this.cartService.addToCart(user.id, dto);
    }

    @Patch('items/:productId')
    updateCartItem(
        @CurrentUser() user: any,
        @Param('productId') productId: string,
        @Body() dto: UpdateCartItemDto,
    ) {
        return this.cartService.updateCartItem(user.id, productId, dto);
    }

    @Delete('items/:productId')
    removeFromCart(
        @CurrentUser() user: any,
        @Param('productId') productId: string,
    ) {
        return this.cartService.removeFromCart(user.id, productId);
    }

    @Delete()
    clearCart(@CurrentUser() user: any) {
        return this.cartService.clearCart(user.id);
    }

    @Post('checkout')
    checkout(
        @CurrentUser() user: any,
        @Body() dto: CheckoutDto,
    ) {
        return this.cartService.checkout(user.id, dto);
    }
}
