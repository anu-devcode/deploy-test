import { ConfigService } from '@nestjs/config';
export declare class IntegrationsService {
    private configService;
    private marketingApiUrl;
    private superAdminApiUrl;
    constructor(configService: ConfigService);
    notifyMarketingOfTenantRegistration(tenantData: {
        id: string;
        name: string;
        slug: string;
    }): Promise<any>;
    verifyTenantWithSuperAdmin(tenantId: string): Promise<any>;
    syncOrderToSuperAdmin(orderData: {
        orderId: string;
        tenantId: string;
        total: number;
    }): Promise<any>;
}
