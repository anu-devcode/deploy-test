import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto';
import { TenantId } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('wishlist')
@UseGuards(AuthGuard('jwt'))
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    @Get(':customerId')
    getWishlist(@Param('customerId') customerId: string, @TenantId() tenantId: string) {
        return this.wishlistService.getWishlist(customerId, tenantId);
    }

    @Post(':customerId/items')
    addToWishlist(
        @Param('customerId') customerId: string,
        @Body() dto: AddToWishlistDto,
        @TenantId() tenantId: string,
    ) {
        return this.wishlistService.addToWishlist(customerId, dto, tenantId);
    }

    @Delete(':customerId/items/:productId')
    removeFromWishlist(
        @Param('customerId') customerId: string,
        @Param('productId') productId: string,
        @TenantId() tenantId: string,
    ) {
        return this.wishlistService.removeFromWishlist(customerId, productId, tenantId);
    }

    @Delete(':customerId')
    clearWishlist(@Param('customerId') customerId: string, @TenantId() tenantId: string) {
        return this.wishlistService.clearWishlist(customerId, tenantId);
    }
}
