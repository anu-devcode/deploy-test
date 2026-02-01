import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto, UpdateWarehouseDto, StockAdjustmentDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('warehouses')
@UseGuards(AuthGuard('jwt'))
export class WarehouseController {
    constructor(private readonly warehouseService: WarehouseService) { }

    @Post()
    create(@Body() dto: CreateWarehouseDto) {
        return this.warehouseService.create(dto);
    }

    @Get()
    findAll() {
        return this.warehouseService.findAll();
    }

    @Get('summary')
    getInventorySummary() {
        return this.warehouseService.getInventorySummary();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.warehouseService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateWarehouseDto,
    ) {
        return this.warehouseService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.warehouseService.remove(id);
    }

    @Post(':id/adjust')
    adjustStock(
        @Param('id') id: string,
        @Body() dto: StockAdjustmentDto,
    ) {
        return this.warehouseService.adjustStock(id, dto);
    }

    @Get(':id/movements')
    getMovements(@Param('id') id: string) {
        return this.warehouseService.getStockMovements(id);
    }
}
