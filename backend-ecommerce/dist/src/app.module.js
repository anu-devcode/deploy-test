"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_1 = require("./prisma");
const common_2 = require("./common");
const tenants_1 = require("./tenants");
const auth_1 = require("./auth");
const products_1 = require("./products");
const orders_1 = require("./orders");
const integrations_1 = require("./integrations");
const customers_1 = require("./customers");
const cart_1 = require("./cart");
const warehouse_1 = require("./warehouse");
const payments_1 = require("./payments");
const cms_1 = require("./cms");
const reviews_1 = require("./reviews");
const delivery_1 = require("./delivery");
const analytics_1 = require("./analytics");
const storefront_1 = require("./storefront");
const categories_1 = require("./categories");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(common_2.TenantMiddleware)
            .exclude({ path: 'tenants', method: common_1.RequestMethod.ALL }, { path: 'health', method: common_1.RequestMethod.GET }, { path: 'auth/register', method: common_1.RequestMethod.POST }, { path: 'auth/login', method: common_1.RequestMethod.POST })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_1.PrismaModule,
            common_2.CommonModule,
            tenants_1.TenantsModule,
            auth_1.AuthModule,
            products_1.ProductsModule,
            orders_1.OrdersModule,
            integrations_1.IntegrationsModule,
            customers_1.CustomersModule,
            cart_1.CartModule,
            warehouse_1.WarehouseModule,
            payments_1.PaymentsModule,
            cms_1.CmsModule,
            reviews_1.ReviewsModule,
            delivery_1.DeliveryModule,
            analytics_1.AnalyticsModule,
            storefront_1.StorefrontModule,
            categories_1.CategoriesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map