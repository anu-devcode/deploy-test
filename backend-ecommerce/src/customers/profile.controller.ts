import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/customer.dto';
import { CurrentUser } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
    constructor(private readonly customersService: CustomersService) { }

    @Get()
    getProfile(@CurrentUser() user: any) {
        return this.customersService.getProfile(user.sub);
    }

    @Patch()
    updateProfile(
        @CurrentUser() user: any,
        @Body() dto: UpdateCustomerDto,
    ) {
        return this.customersService.updateProfile(user.sub, dto);
    }

    @Get('billing')
    getBillingInfo(@CurrentUser() user: any) {
        return this.customersService.getBillingInfo(user.sub);
    }

    @Get('invoices')
    getInvoices(@CurrentUser() user: any) {
        return this.customersService.getInvoices(user.sub);
    }
}
