import { IsString, IsOptional, IsEnum, IsNumber, IsArray, IsDateString, IsBoolean, Min } from 'class-validator';
import { PromotionType, PromotionTarget, PromoBusinessType } from '@prisma/client';

export class CreatePromotionDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    code?: string;

    @IsEnum(PromotionType)
    type: PromotionType;

    @IsEnum(PromotionTarget)
    target: PromotionTarget;

    @IsArray()
    @IsString({ each: true })
    targetIds: string[];

    @IsNumber()
    @Min(0)
    value: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    minAmount?: number;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsNumber()
    usageLimit?: number;

    @IsOptional()
    @IsEnum(PromoBusinessType)
    businessType?: PromoBusinessType;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdatePromotionDto {
    @IsOptional() @IsString() name?: string;
    @IsOptional() @IsString() description?: string;
    @IsOptional() @IsString() code?: string;
    @IsOptional() @IsEnum(PromotionType) type?: PromotionType;
    @IsOptional() @IsEnum(PromotionTarget) target?: PromotionTarget;
    @IsOptional() @IsArray() @IsString({ each: true }) targetIds?: string[];
    @IsOptional() @IsNumber() @Min(0) value?: number;
    @IsOptional() @IsNumber() @Min(0) minAmount?: number;
    @IsOptional() @IsDateString() startDate?: string;
    @IsOptional() @IsDateString() endDate?: string;
    @IsOptional() @IsNumber() usageLimit?: number;
    @IsOptional() @IsEnum(PromoBusinessType) businessType?: PromoBusinessType;
    @IsOptional() @IsBoolean() isActive?: boolean;
}

export class EvaluatePromotionDto {
    @IsOptional()
    @IsString()
    code?: string;

    @IsArray()
    items: {
        productId: string;
        categoryId: string;
        price: number;
        quantity: number;
    }[];

    @IsEnum(PromoBusinessType)
    businessType: PromoBusinessType;
}
