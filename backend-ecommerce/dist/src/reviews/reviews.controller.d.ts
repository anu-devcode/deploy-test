import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsController {
    private readonly reviewsService;
    private readonly prisma;
    constructor(reviewsService: ReviewsService, prisma: PrismaService);
    create(req: any, dto: CreateReviewDto, tenantId: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReviewStatus;
        customerId: string;
        rating: number;
        comment: string | null;
        productId: string;
    }>;
    findAll(productId: string, tenantId: string): Promise<({
        customer: {
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReviewStatus;
        customerId: string;
        rating: number;
        comment: string | null;
        productId: string;
    })[]>;
    getStats(productId: string, tenantId: string): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
    update(req: any, id: string, dto: UpdateReviewDto, tenantId: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReviewStatus;
        customerId: string;
        rating: number;
        comment: string | null;
        productId: string;
    }>;
    remove(req: any, id: string, tenantId: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReviewStatus;
        customerId: string;
        rating: number;
        comment: string | null;
        productId: string;
    }>;
}
