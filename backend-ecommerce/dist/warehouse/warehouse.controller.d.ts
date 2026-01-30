import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto, UpdateWarehouseDto, StockAdjustmentDto } from './dto';
export declare class WarehouseController {
    private readonly warehouseService;
    constructor(warehouseService: WarehouseService);
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
    getInventorySummary(tenantId: string): Promise<{
        totalProducts: number;
        lowStockProducts: number;
        outOfStockProducts: number;
        warehouses: number;
    }>;
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
    adjustStock(id: string, dto: StockAdjustmentDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        warehouseId: string;
        productId: string;
        quantity: number;
        type: import("@prisma/client").$Enums.MovementType;
        reference: string | null;
    }>;
    getMovements(id: string, tenantId: string): Promise<({
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
}
