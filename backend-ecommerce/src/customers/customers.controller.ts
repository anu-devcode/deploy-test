import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { TenantId, CurrentUser } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('customers')
@UseGuards(AuthGuard('jwt'))
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Post()
    create(@Body() dto: CreateCustomerDto, @TenantId() tenantId: string) {
        return this.customersService.create(dto, tenantId);
    }

    @Get()
    findAll(@TenantId() tenantId: string, @CurrentUser() user: any) {
        return this.customersService.findAll(tenantId, user.role);
    }

    @Get('stats')
    getStats(@TenantId() tenantId: string) {
        return this.customersService.getCustomerStats(tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @TenantId() tenantId: string, @CurrentUser() user: any) {
        return this.customersService.findOne(id, tenantId, user.role);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateCustomerDto,
        @TenantId() tenantId: string,
    ) {
        return this.customersService.update(id, dto, tenantId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.customersService.remove(id, tenantId);
    }
}
