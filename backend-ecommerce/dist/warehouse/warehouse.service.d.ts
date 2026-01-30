import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto, StockAdjustmentDto } from './dto';
export declare class WarehouseService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateWarehouseDto, tenantId: string): Promise<{
        address: string | null;
        city: string | null;
        country: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        code: string;
        isDefault: boolean;
    }>;
    findAll(tenantId: string): Promise<({
        _count: {
            products: number;
            movements: number;
        };
    } & {
        address: string | null;
        city: string | null;
        country: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        code: string;
        isDefault: boolean;
    })[]>;
    findOne(id: string, tenantId: string): Promise<{
        products: {
            id: string;
            name: string;
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
            notes: string | null;
            warehouseId: string;
            productId: string;
            quantity: number;
            type: import("@prisma/client").$Enums.MovementType;
            reference: string | null;
        })[];
    } & {
        address: string | null;
        city: string | null;
        country: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        code: string;
        isDefault: boolean;
    }>;
    update(id: string, dto: UpdateWarehouseDto, tenantId: string): Promise<{
        address: string | null;
        city: string | null;
        country: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        code: string;
        isDefault: boolean;
    }>;
    remove(id: string, tenantId: string): Promise<{
        address: string | null;
        city: string | null;
        country: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        code: string;
        isDefault: boolean;
    }>;
    adjustStock(warehouseId: string, dto: StockAdjustmentDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        warehouseId: string;
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
        notes: string | null;
        warehouseId: string;
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
