import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, IsArray, Min } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    compareAtPrice?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsString()
    sku?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsString()
    warehouseId?: string;

    // Dual Pricing
    @IsOptional()
    @IsBoolean()
    retailEnabled?: boolean;

    @IsOptional()
    @IsNumber()
    @Min(0)
    retailPrice?: number;

    @IsOptional()
    @IsString()
    retailUnit?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    retailMinOrder?: number;

    @IsOptional()
    @IsBoolean()
    bulkEnabled?: boolean;

    @IsOptional()
    @IsNumber()
    @Min(0)
    bulkPrice?: number;

    @IsOptional()
    @IsString()
    bulkUnit?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    bulkMinOrder?: number;
}

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    compareAtPrice?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsString()
    sku?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsString()
    warehouseId?: string;

    // Dual Pricing
    @IsOptional()
    @IsBoolean()
    retailEnabled?: boolean;

    @IsOptional()
    @IsNumber()
    @Min(0)
    retailPrice?: number;

    @IsOptional()
    @IsString()
    retailUnit?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    retailMinOrder?: number;

    @IsOptional()
    @IsBoolean()
    bulkEnabled?: boolean;

    @IsOptional()
    @IsNumber()
    @Min(0)
    bulkPrice?: number;

    @IsOptional()
    @IsString()
    bulkUnit?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    bulkMinOrder?: number;
}

