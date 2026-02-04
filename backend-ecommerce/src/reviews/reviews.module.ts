import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { AdminReviewsController } from './admin-reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';

import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        PrismaModule,
        NotificationsModule,
        EmailModule,
    ],
    controllers: [ReviewsController, AdminReviewsController],
    providers: [ReviewsService],
    exports: [ReviewsService],
})
export class ReviewsModule { }

