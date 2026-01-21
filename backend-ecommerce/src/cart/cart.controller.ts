import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, CheckoutDto } from './dto';
import { TenantId } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get(':customerId')
    getCart(@Param('customerId') customerId: string, @TenantId() tenantId: string) {
        return this.cartService.getOrCreateCart(customerId, tenantId);
    }

    @Post(':customerId/items')
    addToCart(
        @Param('customerId') customerId: string,
        @Body() dto: AddToCartDto,
        @TenantId() tenantId: string,
    ) {
        return this.cartService.addToCart(customerId, dto, tenantId);
    }

    @Patch(':customerId/items/:productId')
    updateCartItem(
        @Param('customerId') customerId: string,
        @Param('productId') productId: string,
        @Body() dto: UpdateCartItemDto,
        @TenantId() tenantId: string,
    ) {
        return this.cartService.updateCartItem(customerId, productId, dto, tenantId);
    }

    @Delete(':customerId/items/:productId')
    removeFromCart(
        @Param('customerId') customerId: string,
        @Param('productId') productId: string,
        @TenantId() tenantId: string,
    ) {
        return this.cartService.removeFromCart(customerId, productId, tenantId);
    }

    @Delete(':customerId')
    clearCart(@Param('customerId') customerId: string, @TenantId() tenantId: string) {
        return this.cartService.clearCart(customerId, tenantId);
    }

    @Post(':customerId/checkout')
    checkout(
        @Param('customerId') customerId: string,
        @Body() dto: CheckoutDto,
        @TenantId() tenantId: string,
    ) {
        return this.cartService.checkout(customerId, dto, tenantId);
    }
}
