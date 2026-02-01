import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @Post()
    create(@Body() dto: CreateOrderDto) {
        return this.ordersService.create(dto);
    }

    // Public tracking for guests
    @Get('track/email')
    trackByEmail(@Query('orderNumber') orderNumber: string, @Query('email') email: string) {
        return this.ordersService.trackByEmail(orderNumber, email);
    }

    @Get('track/token/:token')
    trackByToken(@Param('token') token: string) {
        return this.ordersService.trackByToken(token);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll() {
        return this.ordersService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id/status')
    @UseGuards(AuthGuard('jwt'))
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: OrderStatus,
    ) {
        return this.ordersService.updateStatus(id, status);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string) {
        return this.ordersService.remove(id);
    }
}
