import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [PrismaModule, NotificationsModule, EmailModule],
    controllers: [DeliveryController],
    providers: [DeliveryService],
    exports: [DeliveryService],
})
export class DeliveryModule { }
