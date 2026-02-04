import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    @Get()
    getWishlist(@CurrentUser() user: any) {
        return this.wishlistService.getWishlist(user.id);
    }

    @Get(':customerId')
    getWishlistById(@Param('customerId') customerId: string) {
        return this.wishlistService.getWishlist(customerId);
    }

    @Post(':customerId/items')
    addToWishlist(
        @Param('customerId') customerId: string,
        @Body() dto: AddToWishlistDto,
    ) {
        return this.wishlistService.addToWishlist(customerId, dto);
    }

    @Delete(':customerId/items/:productId')
    removeFromWishlist(
        @Param('customerId') customerId: string,
        @Param('productId') productId: string,
    ) {
        return this.wishlistService.removeFromWishlist(customerId, productId);
    }

    @Delete()
    clearWishlist(@CurrentUser() user: any) {
        return this.wishlistService.clearWishlist(user.id);
    }

    @Delete(':customerId')
    clearWishlistById(@Param('customerId') customerId: string) {
        return this.wishlistService.clearWishlist(customerId);
    }
}
