import { Controller, Get, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/reviews')
@UseGuards(AuthGuard('jwt'))
export class AdminReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Get()
    @Get()
    getAllReviews(@Query('status') status?: string) {
        return this.reviewsService.getAllReviewsAdmin(status);
    }

    @Get('pending')
    @Get('pending')
    getPendingReviews() {
        return this.reviewsService.getPendingReviews();
    }

    @Patch(':id/moderate')
    moderateReview(
        @Param('id') id: string,
        @Body('status') status: 'APPROVED' | 'REJECTED',
    ) {
        return this.reviewsService.moderateReview(id, status);
    }

    @Delete(':id')
    @Delete(':id')
    deleteReview(@Param('id') id: string) {
        return this.reviewsService.adminDeleteReview(id);
    }
}
