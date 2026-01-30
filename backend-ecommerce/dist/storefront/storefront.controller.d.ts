import { StorefrontService } from './storefront.service';
export declare class StorefrontController {
    private readonly storefrontService;
    constructor(storefrontService: StorefrontService);
    getProducts(tenantId: string, categoryId?: string, search?: string, tags?: string, featured?: string, page?: string, limit?: string, sortBy?: 'price' | 'createdAt' | 'name', sortOrder?: 'asc' | 'desc'): Promise<{
        products: {
            avgRating: number | null;
            reviewCount: number;
            reviews: {
                rating: number;
            }[];
            category: {
                id: string;
                name: string;
                slug: string;
            } | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            name: string;
            description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
            stock: number;
            sku: string | null;
            images: string[];
            tags: string[];
            isPublished: boolean;
            isFeatured: boolean;
            retailEnabled: boolean;
            retailPrice: import("@prisma/client-runtime-utils").Decimal | null;
            retailUnit: string | null;
            retailMinOrder: number | null;
            bulkEnabled: boolean;
            bulkPrice: import("@prisma/client-runtime-utils").Decimal | null;
            bulkUnit: string | null;
            bulkMinOrder: number | null;
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
        reviews: ({
            customer: {
                firstName: string | null;
                lastName: string | null;
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
        })[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            parentId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
        stock: number;
        sku: string | null;
        images: string[];
        tags: string[];
        isPublished: boolean;
        isFeatured: boolean;
        retailEnabled: boolean;
        retailPrice: import("@prisma/client-runtime-utils").Decimal | null;
        retailUnit: string | null;
        retailMinOrder: number | null;
        bulkEnabled: boolean;
        bulkPrice: import("@prisma/client-runtime-utils").Decimal | null;
        bulkUnit: string | null;
        bulkMinOrder: number | null;
        categoryId: string | null;
        warehouseId: string | null;
    }) | null>;
    getFeaturedProducts(tenantId: string, limit?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
        stock: number;
        sku: string | null;
        images: string[];
        tags: string[];
        isPublished: boolean;
        isFeatured: boolean;
        retailEnabled: boolean;
        retailPrice: import("@prisma/client-runtime-utils").Decimal | null;
        retailUnit: string | null;
        retailMinOrder: number | null;
        bulkEnabled: boolean;
        bulkPrice: import("@prisma/client-runtime-utils").Decimal | null;
        bulkUnit: string | null;
        bulkMinOrder: number | null;
        categoryId: string | null;
        warehouseId: string | null;
    }[]>;
    getCategories(tenantId: string): Promise<({
        _count: {
            products: number;
        };
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            parentId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        parentId: string | null;
    })[]>;
    getProductSuggestions(id: string, tenantId: string, limit?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
        stock: number;
        sku: string | null;
        images: string[];
        tags: string[];
        isPublished: boolean;
        isFeatured: boolean;
        retailEnabled: boolean;
        retailPrice: import("@prisma/client-runtime-utils").Decimal | null;
        retailUnit: string | null;
        retailMinOrder: number | null;
        bulkEnabled: boolean;
        bulkPrice: import("@prisma/client-runtime-utils").Decimal | null;
        bulkUnit: string | null;
        bulkMinOrder: number | null;
        categoryId: string | null;
        warehouseId: string | null;
    }[]>;
    getCmsPage(slug: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        slug: string;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    } | null>;
    getTenantConfig(slug: string): Promise<{
        id: string;
        name: string;
        slug: string;
        config: import("@prisma/client/runtime/client").JsonValue;
    } | null>;
}
