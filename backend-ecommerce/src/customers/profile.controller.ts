import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/customer.dto';
import { TenantId, CurrentUser } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
    constructor(private readonly customersService: CustomersService) { }

    @Get()
    getProfile(@CurrentUser() user: any, @TenantId() tenantId: string) {
        return this.customersService.getProfile(user.sub, tenantId);
    }

    @Patch()
    updateProfile(
        @CurrentUser() user: any,
        @Body() dto: UpdateCustomerDto,
        @TenantId() tenantId: string,
    ) {
        return this.customersService.updateProfile(user.sub, dto, tenantId);
    }

    @Get('billing')
    getBillingInfo(@CurrentUser() user: any, @TenantId() tenantId: string) {
        return this.customersService.getBillingInfo(user.sub, tenantId);
    }

    @Get('invoices')
    getInvoices(@CurrentUser() user: any, @TenantId() tenantId: string) {
        return this.customersService.getInvoices(user.sub, tenantId);
    }
}
