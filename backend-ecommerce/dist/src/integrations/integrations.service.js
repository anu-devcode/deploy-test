"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let IntegrationsService = class IntegrationsService {
    configService;
    marketingApiUrl;
    superAdminApiUrl;
    constructor(configService) {
        this.configService = configService;
        this.marketingApiUrl = this.configService.get('MARKETING_API_URL') || '';
        this.superAdminApiUrl = this.configService.get('SUPERADMIN_API_URL') || '';
    }
    async notifyMarketingOfTenantRegistration(tenantData) {
        if (!this.marketingApiUrl) {
            console.warn('Marketing API URL not configured');
            return null;
        }
        try {
            const response = await fetch(`${this.marketingApiUrl}/webhooks/tenant-registered`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tenantData),
            });
            return response.json();
        }
        catch (error) {
            console.error('Error notifying marketing platform:', error);
            throw new common_1.HttpException('Failed to notify marketing platform', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async verifyTenantWithSuperAdmin(tenantId) {
        if (!this.superAdminApiUrl) {
            console.warn('Super-Admin API URL not configured');
            return { verified: true };
        }
        try {
            const response = await fetch(`${this.superAdminApiUrl}/tenants/${tenantId}/verify`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            return response.json();
        }
        catch (error) {
            console.error('Error verifying with super-admin:', error);
            throw new common_1.HttpException('Failed to verify with super-admin', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async syncOrderToSuperAdmin(orderData) {
        if (!this.superAdminApiUrl) {
            return null;
        }
        try {
            const response = await fetch(`${this.superAdminApiUrl}/analytics/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
            return response.json();
        }
        catch (error) {
            console.error('Error syncing order to super-admin:', error);
            return null;
        }
    }
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map