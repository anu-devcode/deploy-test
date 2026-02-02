import { Controller, Get, Param, Query } from '@nestjs/common';
import { StorefrontService } from './storefront.service';


@Controller('storefront')
export class StorefrontController {
    constructor(private readonly storefrontService: StorefrontService) { }

    @Get('products')
    getProducts(
        @Query('categoryId') categoryId?: string,
        @Query('search') search?: string,
        @Query('tags') tags?: string,
        @Query('featured') featured?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sortBy') sortBy?: 'price' | 'createdAt' | 'name',
        @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    ) {
        return this.storefrontService.getProducts({
            categoryId,
            search,
            tags: tags ? tags.split(',') : undefined,
            featured: featured === 'true',
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
            sortBy,
            sortOrder,
        });
    }

    @Get('products/:id')
    getProduct(@Param('id') id: string) {
        return this.storefrontService.getProduct(id);
    }

    @Get('featured')
    getFeaturedProducts(@Query('limit') limit?: string) {
        return this.storefrontService.getFeaturedProducts(limit ? parseInt(limit) : 8);
    }

    @Get('categories')
    getCategories() {
        return this.storefrontService.getCategories();
    }

    @Get('products/:id/suggestions')
    getProductSuggestions(
        @Param('id') id: string,
        @Query('limit') limit?: string,
    ) {
        return this.storefrontService.getProductSuggestions(id, limit ? parseInt(limit) : 4);
    }

    @Get('pages/:slug')
    getCmsPage(@Param('slug') slug: string) {
        return this.storefrontService.getCmsPage(slug);
    }

    @Get('config/:slug')
    getTenantConfig(@Param('slug') slug: string) {
        return this.storefrontService.getTenantConfig(slug);
    }

    @Get('promotions')
    getPromotions() {
        return this.storefrontService.getPromotions();
    }

    @Get('search')
    globalSearch(@Query('q') query: string) {
        return this.storefrontService.globalSearch(query);
    }
}
