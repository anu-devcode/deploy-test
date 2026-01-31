import { Controller, Get, Post, Delete, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Req } from '@nestjs/common';

@Controller('profile/addresses')
@UseGuards(AuthGuard('jwt'))
export class AddressesController {
    constructor(private readonly customersService: CustomersService) { }

    @Get()
    getAddresses(@Req() req: any) {
        return this.customersService.getAddresses(req.user.id);
    }

    @Post()
    addAddress(@Req() req: any, @Body() dto: CreateAddressDto) {
        return this.customersService.addAddress(req.user.id, dto);
    }

    @Delete(':id')
    deleteAddress(@Req() req: any, @Param('id') id: string) {
        return this.customersService.deleteAddress(req.user.id, id);
    }

    @Patch(':id/default')
    setAddressDefault(@Req() req: any, @Param('id') id: string) {
        return this.customersService.setAddressDefault(req.user.id, id);
    }
}
