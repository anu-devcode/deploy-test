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
exports.StorefrontService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StorefrontService = class StorefrontService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProducts(tenantId, options) {
        const { categoryId, search, tags, featured, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = options || {};
        const where = {
            tenantId,
            isPublished: true,
        };
        if (categoryId)
            where.categoryId = categoryId;
        if (featured)
            where.isFeatured = true;
        if (tags?.length)
            where.tags = { hasSome: tags };
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
    async getProduct(id, tenantId) {
        return this.prisma.product.findFirst({
            where: { id, tenantId, isPublished: true },
            include: {
                category: true,
                reviews: {
                    where: { status: 'APPROVED' },
                    include: { customer: { select: { firstName: true, lastName: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
    }
    async getFeaturedProducts(tenantId, limit = 8) {
        return this.prisma.product.findMany({
            where: { tenantId, isPublished: true, isFeatured: true },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getCategories(tenantId) {
        const categories = await this.prisma.category.findMany({
            include: {
                children: true,
                _count: { select: { products: { where: { isPublished: true, tenantId } } } },
            },
            where: { parentId: null },
        });
        return categories;
    }
    async getTenantConfig(tenantSlug) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug: tenantSlug },
            select: { id: true, name: true, slug: true, config: true },
        });
        return tenant;
    }
    async getCmsPage(slug, tenantId) {
        return this.prisma.cmsPage.findFirst({
            where: { slug, tenantId, published: true },
        });
    }
    async getProductSuggestions(productId, tenantId, limit = 4) {
        const product = await this.prisma.product.findFirst({
            where: { id: productId, tenantId },
            select: { categoryId: true, tags: true },
        });
        if (!product)
            return [];
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
};
exports.StorefrontService = StorefrontService;
exports.StorefrontService = StorefrontService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StorefrontService);
//# sourceMappingURL=storefront.service.js.map