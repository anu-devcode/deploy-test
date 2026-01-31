import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway
    ) { }

    async create(dto: CreateProductDto, tenantId: string) {
        const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return this.prisma.product.create({
            data: {
                ...dto,
                slug,
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
        const product = await this.prisma.product.update({
            where: { id },
            data: dto,
        });

        // Emit WebSocket Events
        this.eventsGateway.notifyProductUpdate(tenantId, product);

        if (dto.stock !== undefined) {
            this.eventsGateway.notifyInventoryUpdate(tenantId, id, dto.stock);
        }

        return product;
    }

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId);
        return this.prisma.product.delete({ where: { id } });
    }
}
