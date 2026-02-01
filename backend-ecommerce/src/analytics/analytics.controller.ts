import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('dashboard')
    getDashboardStats() {
        return this.analyticsService.getDashboardStats();
    }

    @Get('recent-orders')
    getRecentOrders(@Query('limit') limit?: string) {
        return this.analyticsService.getRecentOrders(limit ? parseInt(limit) : 10);
    }

    @Get('sales')
    getSalesOverTime(@Query('days') days?: string) {
        return this.analyticsService.getSalesOverTime(days ? parseInt(days) : 30);
    }

    @Get('top-products')
    getTopProducts(@Query('limit') limit?: string) {
        return this.analyticsService.getTopProducts(limit ? parseInt(limit) : 5);
    }

    @Get('order-status')
    getOrderStatusBreakdown() {
        return this.analyticsService.getOrderStatusBreakdown();
    }

    @Get('pending-reviews')
    getPendingReviews() {
        return this.analyticsService.getPendingReviews();
    }
}
