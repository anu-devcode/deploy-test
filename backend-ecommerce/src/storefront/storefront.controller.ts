import { Controller, Get, Param, Query } from '@nestjs/common';
import { StorefrontService } from './storefront.service';
import { TenantId } from '../common/decorators';

@Controller('storefront')
export class StorefrontController {
    constructor(private readonly storefrontService: StorefrontService) { }

    @Get('products')
    getProducts(
        @TenantId() tenantId: string,
        @Query('categoryId') categoryId?: string,
        @Query('search') search?: string,
        @Query('tags') tags?: string,
        @Query('featured') featured?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sortBy') sortBy?: 'price' | 'createdAt' | 'name',
        @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    ) {
        return this.storefrontService.getProducts(tenantId, {
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
    getProduct(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.storefrontService.getProduct(id, tenantId);
    }

    @Get('featured')
    getFeaturedProducts(@TenantId() tenantId: string, @Query('limit') limit?: string) {
        return this.storefrontService.getFeaturedProducts(tenantId, limit ? parseInt(limit) : 8);
    }

    @Get('categories')
    getCategories(@TenantId() tenantId: string) {
        return this.storefrontService.getCategories(tenantId);
    }

    @Get('products/:id/suggestions')
    getProductSuggestions(
        @Param('id') id: string,
        @TenantId() tenantId: string,
        @Query('limit') limit?: string,
    ) {
        return this.storefrontService.getProductSuggestions(id, tenantId, limit ? parseInt(limit) : 4);
    }

    @Get('pages/:slug')
    getCmsPage(@Param('slug') slug: string, @TenantId() tenantId: string) {
        return this.storefrontService.getCmsPage(slug, tenantId);
    }

    @Get('config/:slug')
    getTenantConfig(@Param('slug') slug: string) {
        return this.storefrontService.getTenantConfig(slug);
    }
}
