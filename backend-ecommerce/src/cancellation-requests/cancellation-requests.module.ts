import { Module } from '@nestjs/common';
import { CancellationRequestsController } from './cancellation-requests.controller';
import { CancellationRequestsService } from './cancellation-requests.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [PrismaModule, NotificationsModule, EmailModule],
    controllers: [CancellationRequestsController],
    providers: [CancellationRequestsService],
    exports: [CancellationRequestsService],
})
export class CancellationRequestsModule { }
