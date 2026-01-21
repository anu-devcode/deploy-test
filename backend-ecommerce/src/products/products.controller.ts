import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { TenantId } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() dto: CreateProductDto, @TenantId() tenantId: string) {
        return this.productsService.create(dto, tenantId);
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.productsService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.productsService.findOne(id, tenantId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductDto, @TenantId() tenantId: string) {
        return this.productsService.update(id, dto, tenantId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.productsService.remove(id, tenantId);
    }
}
