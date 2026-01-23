import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { CommonModule, TenantMiddleware } from './common';
import { TenantsModule } from './tenants';
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
// import { EventsModule } from './events'; // Temporary: Disabled due to dependency issue

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CommonModule,
    TenantsModule,
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
    // EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'tenants', method: RequestMethod.ALL },
        { path: 'health', method: RequestMethod.GET },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
