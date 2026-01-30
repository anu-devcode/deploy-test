import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto, StockAdjustmentDto } from './dto';
import { MovementType } from '@prisma/client';

@Injectable()
export class WarehouseService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateWarehouseDto, tenantId: string) {
        // Check code uniqueness
        const existing = await this.prisma.warehouse.findFirst({
            where: { code: dto.code, tenantId },
        });

        if (existing) {
            throw new ConflictException('Warehouse with this code already exists');
        }

        // If this is marked as default, unset other defaults
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

    async findAll(tenantId: string) {
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

    async findOne(id: string, tenantId: string) {
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
            throw new NotFoundException('Warehouse not found');
        }

        return warehouse;
    }

    async update(id: string, dto: UpdateWarehouseDto, tenantId: string) {
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

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId);

        // Check if warehouse has products
        const productCount = await this.prisma.product.count({
            where: { warehouseId: id },
        });

        if (productCount > 0) {
            throw new ConflictException('Cannot delete warehouse with products');
        }

        return this.prisma.warehouse.delete({ where: { id } });
    }

    async adjustStock(warehouseId: string, dto: StockAdjustmentDto, tenantId: string) {
        const warehouse = await this.findOne(warehouseId, tenantId);

        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId, tenantId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Create movement and update stock in transaction
        return this.prisma.$transaction(async (tx) => {
            // Create stock movement
            const movement = await tx.stockMovement.create({
                data: {
                    productId: dto.productId,
                    warehouseId,
                    quantity: dto.quantity,
                    type: dto.type || MovementType.ADJUSTMENT,
                    notes: dto.notes,
                },
            });

            // Update product stock
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

    async getStockMovements(warehouseId: string, tenantId: string) {
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

    async getInventorySummary(tenantId: string) {
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
}
