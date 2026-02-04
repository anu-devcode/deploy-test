import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class ReviewsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
        private emailService: EmailService,
    ) { }

    async create(customerId: string, dto: CreateReviewDto) {
        // Check if product exists
        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Verify purchase exists and is delivered
        const canReview = await this.canReview(customerId, dto.productId);
        if (!canReview) {
            throw new ForbiddenException('You must have a successful, delivered purchase for this product to leave a review.');
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
                status: 'PENDING',
            },
        });
    }

    async findAll(productId: string) {
        return this.prisma.review.findMany({
            where: { productId, status: 'APPROVED' },
            include: {
                customer: {
                    select: { firstName: true, lastName: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getProductStats(productId: string) {
        const reviews = await this.prisma.review.findMany({
            where: { productId, status: 'APPROVED' },
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

    async update(id: string, customerId: string, dto: UpdateReviewDto) {
        const review = await this.prisma.review.findFirst({
            where: { id },
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

    async remove(id: string, customerId: string) {
        const review = await this.prisma.review.findFirst({
            where: { id },
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
    async getPendingReviews() {
        return this.prisma.review.findMany({
            where: { status: 'PENDING' },
            include: {
                customer: { select: { firstName: true, lastName: true, email: true } },
                product: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    async getAllReviewsAdmin(status?: string) {
        const where: any = {};
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

    async moderateReview(id: string, status: 'APPROVED' | 'REJECTED') {
        const updatedReview = await this.prisma.review.update({
            where: { id },
            data: { status },
            include: {
                product: { select: { name: true, slug: true } },
                customer: { select: { firstName: true, lastName: true, email: true } }
            }
        });

        // Send notification if approved
        if (status === 'APPROVED' && updatedReview.customerId) {
            const fullName = [updatedReview.customer?.firstName, updatedReview.customer?.lastName].filter(Boolean).join(' ') || 'Customer';

            await this.notificationsService.create({
                customerId: updatedReview.customerId,
                type: 'ENGAGEMENT' as any,
                title: 'Review Approved',
                message: `Your review for ${updatedReview.product.name} has been approved!`,
                link: `/products/${updatedReview.product.slug}`
            });

            await this.emailService.sendReviewUpdate(
                updatedReview.customer.email || '',
                fullName,
                updatedReview.product.name,
                'approved',
                updatedReview.comment || '',
                undefined,
                updatedReview.product.slug
            );
        }

        return updatedReview;
    }

    async replyToReview(id: string, reply: string) {
        const review = await this.prisma.review.findUnique({
            where: { id },
            include: {
                product: { select: { name: true, slug: true } },
                customer: { select: { firstName: true, lastName: true, email: true } }
            }
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        const updatedReview = await this.prisma.review.update({
            where: { id },
            data: { reply },
        });

        if (review.customerId) {
            const fullName = [review.customer?.firstName, review.customer?.lastName].filter(Boolean).join(' ') || 'Customer';

            await this.notificationsService.create({
                customerId: review.customerId,
                type: 'ENGAGEMENT' as any,
                title: 'Response to your review',
                message: `Staff has replied to your review of ${review.product.name}.`,
                link: `/products/${review.product.slug}`
            });

            await this.emailService.sendReviewUpdate(
                review.customer.email || '',
                fullName,
                review.product.name,
                'replied',
                review.comment || '',
                reply,
                review.product.slug
            );
        }

        return updatedReview;
    }

    async adminDeleteReview(id: string) {
        const review = await this.prisma.review.findFirst({
            where: { id },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return this.prisma.review.delete({ where: { id } });
    }

    async canReview(customerId: string, productId: string): Promise<boolean> {
        const orderCount = await this.prisma.order.count({
            where: {
                customerId,
                status: 'DELIVERED',
                items: {
                    some: {
                        productId: productId
                    }
                }
            }
        });

        return orderCount > 0;
    }
}
