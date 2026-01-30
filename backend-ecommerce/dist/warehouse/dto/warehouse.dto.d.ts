import { MovementType } from '@prisma/client';
export declare class CreateWarehouseDto {
    name: string;
    code: string;
    address?: string;
    city?: string;
    country?: string;
    isDefault?: boolean;
}
export declare class UpdateWarehouseDto {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    isDefault?: boolean;
}
export declare class StockAdjustmentDto {
    productId: string;
    quantity: number;
    type?: MovementType;
    notes?: string;
}
