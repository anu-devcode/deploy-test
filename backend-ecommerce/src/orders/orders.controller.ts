import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';
import { TenantId } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() dto: CreateOrderDto, @TenantId() tenantId: string) {
        return this.ordersService.create(dto, tenantId);
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.ordersService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.ordersService.findOne(id, tenantId);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: OrderStatus,
        @TenantId() tenantId: string,
    ) {
        return this.ordersService.updateStatus(id, status, tenantId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.ordersService.remove(id, tenantId);
    }
}
