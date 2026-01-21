import { PrismaService } from '../prisma/prisma.service';
export declare class StorefrontService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProducts(tenantId: string, options?: {
        categoryId?: string;
        search?: string;
        tags?: string[];
        featured?: boolean;
        page?: number;
        limit?: number;
        sortBy?: 'price' | 'createdAt' | 'name';
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        products: {
            avgRating: number | null;
            reviewCount: number;
            category: {
                name: string;
                id: string;
                slug: string;
            } | null;
            reviews: {
                rating: number;
            }[];
            tenantId: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
            stock: number;
            sku: string | null;
            images: string[];
            tags: string[];
            isPublished: boolean;
            isFeatured: boolean;
            categoryId: string | null;
            warehouseId: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getProduct(id: string, tenantId: string): Promise<({
        category: {
            name: string;
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
        } | null;
        reviews: ({
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
        })[];
    } & {
        tenantId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
        stock: number;
        sku: string | null;
        images: string[];
        tags: string[];
        isPublished: boolean;
        isFeatured: boolean;
        categoryId: string | null;
        warehouseId: string | null;
    }) | null>;
    getFeaturedProducts(tenantId: string, limit?: number): Promise<{
        tenantId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
        stock: number;
        sku: string | null;
        images: string[];
        tags: string[];
        isPublished: boolean;
        isFeatured: boolean;
        categoryId: string | null;
        warehouseId: string | null;
    }[]>;
    getCategories(tenantId: string): Promise<({
        _count: {
            products: number;
        };
        children: {
            name: string;
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
    })[]>;
    getTenantConfig(tenantSlug: string): Promise<{
        name: string;
        id: string;
        slug: string;
        config: import("@prisma/client/runtime/client").JsonValue;
    } | null>;
    getCmsPage(slug: string, tenantId: string): Promise<{
        tenantId: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    } | null>;
    getProductSuggestions(productId: string, tenantId: string, limit?: number): Promise<{
        tenantId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
        stock: number;
        sku: string | null;
        images: string[];
        tags: string[];
        isPublished: boolean;
        isFeatured: boolean;
        categoryId: string | null;
        warehouseId: string | null;
    }[]>;
}
