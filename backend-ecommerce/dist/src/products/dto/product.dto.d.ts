export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    stock?: number;
    sku?: string;
    images?: string[];
    tags?: string[];
    isPublished?: boolean;
    isFeatured?: boolean;
    categoryId?: string;
    warehouseId?: string;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    compareAtPrice?: number;
    stock?: number;
    sku?: string;
    images?: string[];
    tags?: string[];
    isPublished?: boolean;
    isFeatured?: boolean;
    categoryId?: string;
    warehouseId?: string;
}
