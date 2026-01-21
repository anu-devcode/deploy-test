import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TenantId } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('dashboard')
    getDashboardStats(@TenantId() tenantId: string) {
        return this.analyticsService.getDashboardStats(tenantId);
    }

    @Get('recent-orders')
    getRecentOrders(@TenantId() tenantId: string, @Query('limit') limit?: string) {
        return this.analyticsService.getRecentOrders(tenantId, limit ? parseInt(limit) : 10);
    }

    @Get('sales')
    getSalesOverTime(@TenantId() tenantId: string, @Query('days') days?: string) {
        return this.analyticsService.getSalesOverTime(tenantId, days ? parseInt(days) : 30);
    }

    @Get('top-products')
    getTopProducts(@TenantId() tenantId: string, @Query('limit') limit?: string) {
        return this.analyticsService.getTopProducts(tenantId, limit ? parseInt(limit) : 5);
    }

    @Get('order-status')
    getOrderStatusBreakdown(@TenantId() tenantId: string) {
        return this.analyticsService.getOrderStatusBreakdown(tenantId);
    }

    @Get('pending-reviews')
    getPendingReviews(@TenantId() tenantId: string) {
        return this.analyticsService.getPendingReviews(tenantId);
    }
}
