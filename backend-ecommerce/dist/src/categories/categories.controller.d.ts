import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(dto: CreateCategoryDto): Promise<{
        parent: {
            name: string;
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
        } | null;
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
    }>;
    findAll(): Promise<({
        _count: {
            products: number;
        };
        children: ({
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
        })[];
    } & {
        name: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        products: {
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
        parent: {
            name: string;
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
        } | null;
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
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        parent: {
            name: string;
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
        } | null;
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
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
    }>;
}
