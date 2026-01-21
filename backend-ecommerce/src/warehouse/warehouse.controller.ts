import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto, UpdateWarehouseDto, StockAdjustmentDto } from './dto';
import { TenantId } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('warehouses')
@UseGuards(AuthGuard('jwt'))
export class WarehouseController {
    constructor(private readonly warehouseService: WarehouseService) { }

    @Post()
    create(@Body() dto: CreateWarehouseDto, @TenantId() tenantId: string) {
        return this.warehouseService.create(dto, tenantId);
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.warehouseService.findAll(tenantId);
    }

    @Get('summary')
    getInventorySummary(@TenantId() tenantId: string) {
        return this.warehouseService.getInventorySummary(tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.warehouseService.findOne(id, tenantId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateWarehouseDto,
        @TenantId() tenantId: string,
    ) {
        return this.warehouseService.update(id, dto, tenantId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.warehouseService.remove(id, tenantId);
    }

    @Post(':id/adjust')
    adjustStock(
        @Param('id') id: string,
        @Body() dto: StockAdjustmentDto,
        @TenantId() tenantId: string,
    ) {
        return this.warehouseService.adjustStock(id, dto, tenantId);
    }

    @Get(':id/movements')
    getMovements(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.warehouseService.getStockMovements(id, tenantId);
    }
}
