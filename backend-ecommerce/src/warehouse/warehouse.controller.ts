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

    @Get('stock-logs')
    getStockAuditLogs() {
        return this.warehouseService.getAllStockMovements();
    }

    @Get('stock-logs/product/:productId')
    getProductStockLogs(@Param('productId') productId: string) {
        return this.warehouseService.getProductStockMovements(productId);
    }

    @Get('batches/product/:productId')
    getProductBatches(@Param('productId') productId: string) {
        return this.warehouseService.getProductBatches(productId);
    }

    @Post('stock-movement')
    processStockMovement(@Body() data: any) {
        // Map frontend fields like 'action' to 'type'
        const dto: StockAdjustmentDto = {
            productId: data.productId,
            quantity: data.action === 'STOCK_OUT' ? -Math.abs(data.quantity) : Math.abs(data.quantity),
            type: data.action as any,
            notes: data.reason,
            batchNumber: data.batchNumber,
            grade: data.grade,
        };
        // We'll need a default warehouse if not provided, or frontend should send it.
        // Assuming default warehouse for now if not specified.
        return this.warehouseService.processMovement(dto);
    }
}
