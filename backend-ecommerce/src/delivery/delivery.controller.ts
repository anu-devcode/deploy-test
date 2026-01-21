import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, UpdateDeliveryDto } from './dto';
import { TenantId } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/deliveries')
@UseGuards(AuthGuard('jwt'))
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) { }

    @Post()
    create(@Body() dto: CreateDeliveryDto, @TenantId() tenantId: string) {
        return this.deliveryService.create(dto, tenantId);
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.deliveryService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.deliveryService.findOne(id, tenantId);
    }

    @Get('order/:orderId')
    findByOrder(@Param('orderId') orderId: string, @TenantId() tenantId: string) {
        return this.deliveryService.findByOrder(orderId, tenantId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateDeliveryDto, @TenantId() tenantId: string) {
        return this.deliveryService.update(id, dto, tenantId);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
        @TenantId() tenantId: string,
    ) {
        return this.deliveryService.updateStatus(id, status, tenantId);
    }
}
