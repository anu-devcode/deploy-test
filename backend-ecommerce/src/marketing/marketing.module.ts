import { Module } from '@nestjs/common';
import { MarketingController } from './marketing.controller';
import { MarketingService } from './marketing.service';

import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [PrismaModule, NotificationsModule, EmailModule],
    controllers: [MarketingController],
    providers: [MarketingService],
    exports: [MarketingService],
})
export class MarketingModule { }
