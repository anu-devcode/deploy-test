import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto, ConfirmPaymentDto } from './dto';

import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Get()
    findAll() {
        return this.paymentsService.findAll();
    }

    @Post('initialize')
    initialize(@Body() dto: InitializePaymentDto) {
        return this.paymentsService.initialize(dto);
    }

    @Post(':id/confirm')
    confirm(
        @Param('id') id: string,
        @Body() dto: ConfirmPaymentDto,
    ) {
        return this.paymentsService.confirm(id, dto);
    }

    @Get('order/:orderId')
    getOrderPayments(
        @Param('orderId') orderId: string,
    ) {
        return this.paymentsService.getOrderPayments(orderId);
    }

    @Post(':id/submit-manual')
    submitManual(
        @Param('id') id: string,
        @Body() dto: any, // SubmitManualPaymentDto
    ) {
        return this.paymentsService.submitManual(id, dto);
    }

    @Post(':id/verify')
    verify(
        @Param('id') id: string,
        @Body() dto: any, // VerifyManualPaymentDto
    ) {
        return this.paymentsService.verify(id, dto);
    }
}
