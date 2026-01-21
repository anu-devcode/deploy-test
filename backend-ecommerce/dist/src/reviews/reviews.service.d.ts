import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(customerId: string, dto: CreateReviewDto, tenantId: string): Promise<{
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
    getProductStats(productId: string, tenantId: string): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
    update(id: string, customerId: string, dto: UpdateReviewDto, tenantId: string): Promise<{
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
    remove(id: string, customerId: string, tenantId: string): Promise<{
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
    getPendingReviews(tenantId: string): Promise<({
        product: {
            name: string;
            id: string;
        };
        customer: {
            email: string;
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
    getAllReviewsAdmin(tenantId: string, status?: string): Promise<({
        product: {
            name: string;
            id: string;
        };
        customer: {
            email: string;
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
    moderateReview(id: string, status: 'APPROVED' | 'REJECTED', tenantId: string): Promise<{
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
    adminDeleteReview(id: string, tenantId: string): Promise<{
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
