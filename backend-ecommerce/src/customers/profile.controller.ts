import { Controller, Get, Patch, Body, UseGuards, Post, Delete, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CurrentUser } from '../common/decorators/user.decorator';
import { CreateCustomerDto, UpdateCustomerDto, AddPaymentMethodDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
    constructor(private readonly customersService: CustomersService) { }

    @Get()
    getProfile(@CurrentUser() user: any) {
        return this.customersService.getProfile(user.id);
    }

    @Patch()
    updateProfile(
        @CurrentUser() user: any,
        @Body() dto: UpdateCustomerDto,
    ) {
        return this.customersService.updateProfile(user.id, dto);
    }

    @Get('billing')
    getBillingInfo(@CurrentUser() user: any) {
        return this.customersService.getBillingInfo(user.id);
    }

    @Get('billing/methods')
    getSavedMethods(@CurrentUser() user: any) {
        return this.customersService.getSavedPaymentMethods(user.id);
    }

    @Post('billing/methods')
    addMethod(@CurrentUser() user: any, @Body() dto: AddPaymentMethodDto) {
        return this.customersService.addSavedPaymentMethod(user.id, dto);
    }

    @Delete('billing/methods/:id')
    deleteMethod(@CurrentUser() user: any, @Param('id') methodId: string) {
        return this.customersService.deleteSavedPaymentMethod(user.id, methodId);
    }

    @Patch('billing/methods/:id/default')
    setDefaultMethod(@CurrentUser() user: any, @Param('id') methodId: string) {
        return this.customersService.setSavedPaymentMethodDefault(user.id, methodId);
    }

    @Get('billing/invoices')
    getInvoices(@CurrentUser() user: any) {
        return this.customersService.getInvoices(user.id);
    }
}
