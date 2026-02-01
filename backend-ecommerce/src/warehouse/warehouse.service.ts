import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto, StockAdjustmentDto } from './dto';
import { MovementType } from '@prisma/client';

@Injectable()
export class WarehouseService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateWarehouseDto) {
        // Check code uniqueness
        const existing = await this.prisma.warehouse.findFirst({
            where: { code: dto.code },
        });

        if (existing) {
            throw new ConflictException('Warehouse with this code already exists');
        }

        // If this is marked as default, unset other defaults
        if (dto.isDefault) {
            await this.prisma.warehouse.updateMany({
                where: { isDefault: true },
                data: { isDefault: false },
            });
        }

        return this.prisma.warehouse.create({
            data: {
                ...dto,
            },
        });
    }

    async findAll() {
        return this.prisma.warehouse.findMany({
            include: {
                _count: {
                    select: { products: true, movements: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const warehouse = await this.prisma.warehouse.findFirst({
            where: { id },
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

    async update(id: string, dto: UpdateWarehouseDto) {
        await this.findOne(id);

        if (dto.isDefault) {
            await this.prisma.warehouse.updateMany({
                where: { isDefault: true, NOT: { id } },
                data: { isDefault: false },
            });
        }

        return this.prisma.warehouse.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        // Check if warehouse has products
        const productCount = await this.prisma.product.count({
            where: { warehouseId: id },
        });

        if (productCount > 0) {
            throw new ConflictException('Cannot delete warehouse with products');
        }

        return this.prisma.warehouse.delete({ where: { id } });
    }

    async adjustStock(warehouseId: string, dto: StockAdjustmentDto) {
        const warehouse = await this.findOne(warehouseId);

        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId },
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

    async getStockMovements(warehouseId: string) {
        await this.findOne(warehouseId);

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

    async getInventorySummary() {
        const [totalProducts, lowStockProducts, outOfStockProducts, warehouses] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.product.count({ where: { stock: { lte: 10, gt: 0 } } }),
            this.prisma.product.count({ where: { stock: 0 } }),
            this.prisma.warehouse.count(),
        ]);

        return {
            totalProducts,
            lowStockProducts,
            outOfStockProducts,
            warehouses,
        };
    }
}
