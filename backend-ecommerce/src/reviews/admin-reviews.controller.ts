import { Controller, Get, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { TenantId } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/reviews')
@UseGuards(AuthGuard('jwt'))
export class AdminReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Get()
    getAllReviews(@TenantId() tenantId: string, @Query('status') status?: string) {
        return this.reviewsService.getAllReviewsAdmin(tenantId, status);
    }

    @Get('pending')
    getPendingReviews(@TenantId() tenantId: string) {
        return this.reviewsService.getPendingReviews(tenantId);
    }

    @Patch(':id/moderate')
    moderateReview(
        @Param('id') id: string,
        @Body('status') status: 'APPROVED' | 'REJECTED',
        @TenantId() tenantId: string,
    ) {
        return this.reviewsService.moderateReview(id, status, tenantId);
    }

    @Delete(':id')
    deleteReview(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.reviewsService.adminDeleteReview(id, tenantId);
    }
}
