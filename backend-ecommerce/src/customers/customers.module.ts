import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { ProfileController } from './profile.controller';
import { AddressesController } from './addresses.controller';

@Module({
    controllers: [CustomersController, ProfileController, AddressesController],
    providers: [CustomersService],
    exports: [CustomersService],
})
export class CustomersModule { }
