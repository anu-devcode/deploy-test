import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StorefrontService {
    constructor(private readonly prisma: PrismaService) { }

    // Get published products with optional filtering
    async getProducts(tenantId: string, options?: {
        categoryId?: string;
        search?: string;
        tags?: string[];
        featured?: boolean;
        page?: number;
        limit?: number;
        sortBy?: 'price' | 'createdAt' | 'name';
        sortOrder?: 'asc' | 'desc';
    }) {
        const { categoryId, search, tags, featured, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = options || {};

        const where: any = {
            tenantId,
            isPublished: true,
        };

        if (categoryId) where.categoryId = categoryId;
        if (featured) where.isFeatured = true;
        if (tags?.length) where.tags = { hasSome: tags };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    reviews: { where: { status: 'APPROVED' }, select: { rating: true } },
                },
                take: limit,
                skip: (page - 1) * limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.prisma.product.count({ where }),
        ]);

        // Calculate average rating for each product
        const productsWithRating = products.map((product) => {
            const reviews = product.reviews;
            const avgRating = reviews.length
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : null;
            return { ...product, avgRating, reviewCount: reviews.length };
        });

        return {
            products: productsWithRating,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Get single product by ID or SLUG
    async getProduct(idOrSlug: string, tenantId: string) {
        const isUuid = idOrSlug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

        return this.prisma.product.findFirst({
            where: {
                OR: [
                    { id: isUuid ? idOrSlug : undefined },
                    { slug: idOrSlug }
                ],
                tenantId,
                isPublished: true
            },
            include: {
                category: true,
                warehouse: { select: { name: true, city: true } },
                reviews: {
                    where: { status: 'APPROVED' },
                    include: { customer: { select: { firstName: true, lastName: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                stockMovements: {
                    include: { warehouse: { select: { name: true, city: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 20
                }
            },
        });
    }

    // Get featured products
    async getFeaturedProducts(tenantId: string, limit = 8) {
        return this.prisma.product.findMany({
            where: { tenantId, isPublished: true, isFeatured: true },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }

    // Get categories
    async getCategories(tenantId: string) {
        const categories = await this.prisma.category.findMany({
            include: {
                children: true,
                _count: { select: { products: { where: { isPublished: true, tenantId } } } },
            },
            where: { parentId: null },
        });

        return categories;
    }

    // Get tenant storefront config (branding, etc.)
    async getTenantConfig(tenantSlug: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug: tenantSlug },
            select: { id: true, name: true, slug: true, config: true },
        });
        return tenant;
    }

    // Get CMS pages (About, Contact, FAQ, etc.)
    async getCmsPage(slug: string, tenantId: string) {
        return this.prisma.cmsPage.findFirst({
            where: { slug, tenantId, published: true },
        });
    }

    // Product suggestions based on category or tags
    async getProductSuggestions(productId: string, tenantId: string, limit = 4) {
        const product = await this.prisma.product.findFirst({
            where: { id: productId, tenantId },
            select: { categoryId: true, tags: true },
        });

        if (!product) return [];

        return this.prisma.product.findMany({
            where: {
                tenantId,
                isPublished: true,
                id: { not: productId },
                OR: [
                    { categoryId: product.categoryId },
                    { tags: { hasSome: product.tags } },
                ],
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
}
