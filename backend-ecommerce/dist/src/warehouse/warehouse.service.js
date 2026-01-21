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
exports.WarehouseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let WarehouseService = class WarehouseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        const existing = await this.prisma.warehouse.findFirst({
            where: { code: dto.code, tenantId },
        });
        if (existing) {
            throw new common_1.ConflictException('Warehouse with this code already exists');
        }
        if (dto.isDefault) {
            await this.prisma.warehouse.updateMany({
                where: { tenantId, isDefault: true },
                data: { isDefault: false },
            });
        }
        return this.prisma.warehouse.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }
    async findAll(tenantId) {
        return this.prisma.warehouse.findMany({
            where: { tenantId },
            include: {
                _count: {
                    select: { products: true, movements: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, tenantId) {
        const warehouse = await this.prisma.warehouse.findFirst({
            where: { id, tenantId },
            include: {
                products: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                        stock: true,
                    },
                },
                movements: {
                    take: 20,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        product: {
                            select: { name: true, sku: true },
                        },
                    },
                },
            },
        });
        if (!warehouse) {
            throw new common_1.NotFoundException('Warehouse not found');
        }
        return warehouse;
    }
    async update(id, dto, tenantId) {
        await this.findOne(id, tenantId);
        if (dto.isDefault) {
            await this.prisma.warehouse.updateMany({
                where: { tenantId, isDefault: true, NOT: { id } },
                data: { isDefault: false },
            });
        }
        return this.prisma.warehouse.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        const productCount = await this.prisma.product.count({
            where: { warehouseId: id },
        });
        if (productCount > 0) {
            throw new common_1.ConflictException('Cannot delete warehouse with products');
        }
        return this.prisma.warehouse.delete({ where: { id } });
    }
    async adjustStock(warehouseId, dto, tenantId) {
        const warehouse = await this.findOne(warehouseId, tenantId);
        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId, tenantId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.prisma.$transaction(async (tx) => {
            const movement = await tx.stockMovement.create({
                data: {
                    productId: dto.productId,
                    warehouseId,
                    quantity: dto.quantity,
                    type: client_1.MovementType.ADJUSTMENT,
                    notes: dto.notes,
                },
            });
            await tx.product.update({
                where: { id: dto.productId },
                data: {
                    stock: { increment: dto.quantity },
                    warehouseId,
                },
            });
            return movement;
        });
    }
    async getStockMovements(warehouseId, tenantId) {
        await this.findOne(warehouseId, tenantId);
        return this.prisma.stockMovement.findMany({
            where: { warehouseId },
            include: {
                product: {
                    select: { name: true, sku: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    async getInventorySummary(tenantId) {
        const [totalProducts, lowStockProducts, outOfStockProducts, warehouses] = await Promise.all([
            this.prisma.product.count({ where: { tenantId } }),
            this.prisma.product.count({ where: { tenantId, stock: { lte: 10, gt: 0 } } }),
            this.prisma.product.count({ where: { tenantId, stock: 0 } }),
            this.prisma.warehouse.count({ where: { tenantId } }),
        ]);
        return {
            totalProducts,
            lowStockProducts,
            outOfStockProducts,
            warehouses,
        };
    }
};
exports.WarehouseService = WarehouseService;
exports.WarehouseService = WarehouseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WarehouseService);
//# sourceMappingURL=warehouse.service.js.map