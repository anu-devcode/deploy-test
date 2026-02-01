import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * IntegrationsService handles communication with external APIs:
 * - Marketing Frontend
 * - Super-Admin Control Plane
 */
@Injectable()
export class IntegrationsService {
    private marketingApiUrl: string;
    private superAdminApiUrl: string;

    constructor(private configService: ConfigService) {
        this.marketingApiUrl = this.configService.get<string>('MARKETING_API_URL') || '';
        this.superAdminApiUrl = this.configService.get<string>('SUPERADMIN_API_URL') || '';
    }

    /**
     * Notify Marketing Platform of new tenant registration
     */
    async notifyMarketingOfTenantRegistration(tenantData: { id: string; name: string; slug: string }) {
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
        } catch (error) {
            console.error('Error notifying marketing platform:', error);
            throw new HttpException('Failed to notify marketing platform', HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    /**
     * Verify app status with Super-Admin
     */
    async verifyAppWithSuperAdmin() {
        if (!this.superAdminApiUrl) {
            console.warn('Super-Admin API URL not configured');
            return { verified: true }; // Default to verified if no super-admin
        }

        try {
            const response = await fetch(`${this.superAdminApiUrl}/app/verify`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            return response.json();
        } catch (error) {
            console.error('Error verifying with super-admin:', error);
            throw new HttpException('Failed to verify with super-admin', HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    /**
     * Sync order data to Super-Admin for analytics
     */
    async syncOrderToSuperAdmin(orderData: { orderId: string; total: number }) {
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
        } catch (error) {
            console.error('Error syncing order to super-admin:', error);
            // Non-critical, don't throw
            return null;
        }
    }
}
