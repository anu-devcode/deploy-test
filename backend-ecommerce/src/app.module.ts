import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { CommonModule } from './common';
import { AuthModule } from './auth';
import { ProductsModule } from './products';
import { OrdersModule } from './orders';
import { IntegrationsModule } from './integrations';
import { CustomersModule } from './customers';
import { CartModule } from './cart';
import { WarehouseModule } from './warehouse';
import { PaymentsModule } from './payments';
import { CmsModule } from './cms';
import { ReviewsModule } from './reviews';
import { DeliveryModule } from './delivery';
import { AnalyticsModule } from './analytics';
import { StorefrontModule } from './storefront';
import { CategoriesModule } from './categories';
import { WishlistModule } from './wishlist/wishlist.module';
import { AutomationModule } from './automation/automation.module';
import { PromotionsModule } from './promotions/promotions.module';
import { StaffModule } from './staff/staff.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MessagesModule } from './messages/messages.module';
import { EventsModule } from './events';
import { EmailModule } from './email/email.module';
import { MarketingModule } from './marketing/marketing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CommonModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    IntegrationsModule,
    CustomersModule,
    CartModule,
    WarehouseModule,
    PaymentsModule,
    CmsModule,
    ReviewsModule,
    DeliveryModule,
    AnalyticsModule,
    StorefrontModule,
    CategoriesModule,
    AutomationModule,
    WishlistModule,
    PromotionsModule,
    StaffModule,
    NotificationsModule,
    MessagesModule,
    EventsModule,
    EmailModule,
    MarketingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Middleware removed for Single-Tenant Mode
  }
}
