import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateWarehouseDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}

export class UpdateWarehouseDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}

export class StockAdjustmentDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    quantity: number; // positive or negative

    @IsOptional()
    @IsString()
    notes?: string;
}
