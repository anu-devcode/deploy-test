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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(customerId, dto, tenantId) {
        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId, tenantId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existing = await this.prisma.review.findUnique({
            where: {
                productId_customerId: {
                    productId: dto.productId,
                    customerId,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('You have already reviewed this product');
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
    async findAll(productId, tenantId) {
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
    async getProductStats(productId, tenantId) {
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
    async update(id, customerId, dto, tenantId) {
        const review = await this.prisma.review.findFirst({
            where: { id, tenantId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.customerId !== customerId) {
            throw new common_1.ForbiddenException('You can only update your own reviews');
        }
        return this.prisma.review.update({
            where: { id },
            data: { ...dto, status: 'PENDING' },
        });
    }
    async remove(id, customerId, tenantId) {
        const review = await this.prisma.review.findFirst({
            where: { id, tenantId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.customerId !== customerId) {
            throw new common_1.ForbiddenException('You can only delete your own reviews');
        }
        return this.prisma.review.delete({ where: { id } });
    }
    async getPendingReviews(tenantId) {
        return this.prisma.review.findMany({
            where: { tenantId, status: 'PENDING' },
            include: {
                customer: { select: { firstName: true, lastName: true, email: true } },
                product: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async getAllReviewsAdmin(tenantId, status) {
        const where = { tenantId };
        if (status)
            where.status = status;
        return this.prisma.review.findMany({
            where,
            include: {
                customer: { select: { firstName: true, lastName: true, email: true } },
                product: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async moderateReview(id, status, tenantId) {
        const review = await this.prisma.review.findFirst({
            where: { id, tenantId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return this.prisma.review.update({
            where: { id },
            data: { status },
        });
    }
    async adminDeleteReview(id, tenantId) {
        const review = await this.prisma.review.findFirst({
            where: { id, tenantId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return this.prisma.review.delete({ where: { id } });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map