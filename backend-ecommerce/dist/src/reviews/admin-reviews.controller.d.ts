import { ReviewsService } from './reviews.service';
export declare class AdminReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getAllReviews(tenantId: string, status?: string): Promise<({
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
    deleteReview(id: string, tenantId: string): Promise<{
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
