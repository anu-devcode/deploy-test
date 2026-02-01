import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { CurrentUser } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('customers')
@UseGuards(AuthGuard('jwt'))
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Post()
    create(@Body() dto: CreateCustomerDto) {
        return this.customersService.create(dto);
    }

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.customersService.findAll(user.role);
    }

    @Get('stats')
    getStats() {
        return this.customersService.getCustomerStats();
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.customersService.findOne(id, user.role);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateCustomerDto,
    ) {
        return this.customersService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.customersService.remove(id);
    }
}
