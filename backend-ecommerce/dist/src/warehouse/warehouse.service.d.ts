import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto, StockAdjustmentDto } from './dto';
export declare class WarehouseService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateWarehouseDto, tenantId: string): Promise<{
        tenantId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        country: string | null;
        code: string;
        isDefault: boolean;
    }>;
    findAll(tenantId: string): Promise<({
        _count: {
            products: number;
            movements: number;
        };
    } & {
        tenantId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        country: string | null;
        code: string;
        isDefault: boolean;
    })[]>;
    findOne(id: string, tenantId: string): Promise<{
        products: {
            name: string;
            id: string;
            stock: number;
            sku: string | null;
        }[];
        movements: ({
            product: {
                name: string;
                sku: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            warehouseId: string;
            notes: string | null;
            productId: string;
            quantity: number;
            type: import("@prisma/client").$Enums.MovementType;
            reference: string | null;
        })[];
    } & {
        tenantId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        country: string | null;
        code: string;
        isDefault: boolean;
    }>;
    update(id: string, dto: UpdateWarehouseDto, tenantId: string): Promise<{
        tenantId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        country: string | null;
        code: string;
        isDefault: boolean;
    }>;
    remove(id: string, tenantId: string): Promise<{
        tenantId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        country: string | null;
        code: string;
        isDefault: boolean;
    }>;
    adjustStock(warehouseId: string, dto: StockAdjustmentDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        warehouseId: string;
        notes: string | null;
        productId: string;
        quantity: number;
        type: import("@prisma/client").$Enums.MovementType;
        reference: string | null;
    }>;
    getStockMovements(warehouseId: string, tenantId: string): Promise<({
        product: {
            name: string;
            sku: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        warehouseId: string;
        notes: string | null;
        productId: string;
        quantity: number;
        type: import("@prisma/client").$Enums.MovementType;
        reference: string | null;
    })[]>;
    getInventorySummary(tenantId: string): Promise<{
        totalProducts: number;
        lowStockProducts: number;
        outOfStockProducts: number;
        warehouses: number;
    }>;
}
