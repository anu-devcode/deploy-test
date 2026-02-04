import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { AutomationModule } from '../automation/automation.module';

import { NotificationsModule } from '../notifications/notifications.module';
import { PromotionsModule } from '../promotions/promotions.module';

@Module({
    imports: [
        AutomationModule,
        NotificationsModule,
        PromotionsModule
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule { }
