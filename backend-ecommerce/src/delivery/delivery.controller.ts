import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, UpdateDeliveryDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/deliveries')
@UseGuards(AuthGuard('jwt'))
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) { }

    @Post()
    create(@Body() dto: CreateDeliveryDto) {
        return this.deliveryService.create(dto);
    }

    @Get()
    findAll() {
        return this.deliveryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.deliveryService.findOne(id);
    }

    @Get('order/:orderId')
    findByOrder(@Param('orderId') orderId: string) {
        return this.deliveryService.findByOrder(orderId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateDeliveryDto) {
        return this.deliveryService.update(id, dto);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
    ) {
        return this.deliveryService.updateStatus(id, status);
    }
}
