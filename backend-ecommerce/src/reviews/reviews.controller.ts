import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';

import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

@Controller('reviews')
export class ReviewsController {
    constructor(
        private readonly reviewsService: ReviewsService,
        private readonly prisma: PrismaService, // Inject prisma to resolve customerid from user
    ) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Request() req: any, @Body() dto: CreateReviewDto) {
        // Mapping User ID (from JWT) to Customer ID
        // In a real app this would be cleaner service logic or a decorator
        const user = req.user;
        const customer = await this.prisma.customer.findFirst({ where: { email: user.email } });

        if (!customer) {
            throw new Error("Customer profile not found for this user");
        }

        return this.reviewsService.create(customer.id, dto);
    }

    @Get('product/:productId')
    @Get('product/:productId')
    findAll(@Param('productId') productId: string) {
        return this.reviewsService.findAll(productId);
    }

    @Get('product/:productId/stats')
    @Get('product/:productId/stats')
    getStats(@Param('productId') productId: string) {
        return this.reviewsService.getProductStats(productId);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateReviewDto,
    ) {
        const user = req.user;
        const customer = await this.prisma.customer.findFirst({ where: { email: user.email } });
        if (!customer) throw new Error("Customer profile not found");

        return this.reviewsService.update(id, customer.id, dto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Request() req: any, @Param('id') id: string) {
        const user = req.user;
        const customer = await this.prisma.customer.findFirst({ where: { email: user.email } });
        if (!customer) throw new Error("Customer profile not found");

        return this.reviewsService.remove(id, customer.id);
    }
}
