import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto, ConfirmPaymentDto } from './dto';
import { TenantId } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('initialize')
    initialize(@Body() dto: InitializePaymentDto, @TenantId() tenantId: string) {
        return this.paymentsService.initialize(dto, tenantId);
    }

    @Post(':id/confirm')
    confirm(
        @Param('id') id: string,
        @Body() dto: ConfirmPaymentDto,
        @TenantId() tenantId: string,
    ) {
        return this.paymentsService.confirm(id, dto, tenantId);
    }

    @Get('order/:orderId')
    getOrderPayments(
        @Param('orderId') orderId: string,
        @TenantId() tenantId: string,
    ) {
        return this.paymentsService.getOrderPayments(orderId, tenantId);
    }
}
