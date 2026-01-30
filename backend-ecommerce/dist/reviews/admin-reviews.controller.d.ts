import { ReviewsService } from './reviews.service';
export declare class AdminReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getAllReviews(tenantId: string, status?: string): Promise<({
        customer: {
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        product: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import("@prisma/client").$Enums.ReviewStatus;
        customerId: string;
        rating: number;
        comment: string | null;
        productId: string;
    })[]>;
    getPendingReviews(tenantId: string): Promise<({
        customer: {
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        product: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import("@prisma/client").$Enums.ReviewStatus;
        customerId: string;
        rating: number;
        comment: string | null;
        productId: string;
    })[]>;
    moderateReview(id: string, status: 'APPROVED' | 'REJECTED', tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import("@prisma/client").$Enums.ReviewStatus;
        customerId: string;
        rating: number;
        comment: string | null;
        productId: string;
    }>;
    deleteReview(id: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import("@prisma/client").$Enums.ReviewStatus;
        customerId: string;
        rating: number;
        comment: string | null;
        productId: string;
    }>;
}
