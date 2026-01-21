import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateProductDto, tenantId: string) {
        return this.prisma.product.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.product.findMany({
            where: { tenantId },
        });
    }

    async findOne(id: string, tenantId: string) {
        const product = await this.prisma.product.findFirst({
            where: { id, tenantId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: string, dto: UpdateProductDto, tenantId: string) {
        await this.findOne(id, tenantId); // ensures product exists and belongs to tenant
        return this.prisma.product.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId);
        return this.prisma.product.delete({ where: { id } });
    }
}
