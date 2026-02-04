import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

import { AutomationModule } from '../automation/automation.module';

import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        AutomationModule,
        NotificationsModule,
        EmailModule
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService],
    exports: [PaymentsService],
})
export class PaymentsModule { }
