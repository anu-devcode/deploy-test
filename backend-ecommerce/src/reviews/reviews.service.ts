import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async create(customerId: string, dto: CreateReviewDto, tenantId: string) {
        // Check if product exists
        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId, tenantId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Check if customer already reviewed this product
        const existing = await this.prisma.review.findUnique({
            where: {
                productId_customerId: {
                    productId: dto.productId,
                    customerId,
                },
            },
        });

        if (existing) {
            throw new ConflictException('You have already reviewed this product');
        }

        return this.prisma.review.create({
            data: {
                ...dto,
                customerId,
                tenantId,
                status: 'PENDING',
            },
        });
    }

    async findAll(productId: string, tenantId: string) {
        return this.prisma.review.findMany({
            where: { productId, tenantId, status: 'APPROVED' },
            include: {
                customer: {
                    select: { firstName: true, lastName: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getProductStats(productId: string, tenantId: string) {
        const reviews = await this.prisma.review.findMany({
            where: { productId, tenantId, status: 'APPROVED' },
            select: { rating: true },
        });

        const totalReviews = reviews.length;
        if (totalReviews === 0) {
            return { averageRating: 0, totalReviews: 0 };
        }

        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = sum / totalReviews;

        return { averageRating, totalReviews };
    }

    async update(id: string, customerId: string, dto: UpdateReviewDto, tenantId: string) {
        const review = await this.prisma.review.findFirst({
            where: { id, tenantId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.customerId !== customerId) {
            throw new ForbiddenException('You can only update your own reviews');
        }

        return this.prisma.review.update({
            where: { id },
            data: { ...dto, status: 'PENDING' },
        });
    }

    async remove(id: string, customerId: string, tenantId: string) {
        const review = await this.prisma.review.findFirst({
            where: { id, tenantId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.customerId !== customerId) {
            throw new ForbiddenException('You can only delete your own reviews');
        }

        return this.prisma.review.delete({ where: { id } });
    }

    // Admin moderation methods
    async getPendingReviews(tenantId: string) {
        return this.prisma.review.findMany({
            where: { tenantId, status: 'PENDING' },
            include: {
                customer: { select: { firstName: true, lastName: true, email: true } },
                product: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    async getAllReviewsAdmin(tenantId: string, status?: string) {
        const where: any = { tenantId };
        if (status) where.status = status;

        return this.prisma.review.findMany({
            where,
            include: {
                customer: { select: { firstName: true, lastName: true, email: true } },
                product: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async moderateReview(id: string, status: 'APPROVED' | 'REJECTED', tenantId: string) {
        const review = await this.prisma.review.findFirst({
            where: { id, tenantId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return this.prisma.review.update({
            where: { id },
            data: { status },
        });
    }

    async adminDeleteReview(id: string, tenantId: string) {
        const review = await this.prisma.review.findFirst({
            where: { id, tenantId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return this.prisma.review.delete({ where: { id } });
    }
}

