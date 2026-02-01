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

    async create(dto: CreateProductDto) {
        const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return this.prisma.product.create({
            data: {
                ...dto,
                slug,
            },
        });
    }

    async findAll() {
        return this.prisma.product.findMany();
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findFirst({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: string, dto: UpdateProductDto) {
        await this.findOne(id); // ensures product exists
        const product = await this.prisma.product.update({
            where: { id },
            data: dto,
        });

        // Emit WebSocket Events
        this.eventsGateway.notifyProductUpdate(product);

        if (dto.stock !== undefined) {
            this.eventsGateway.notifyInventoryUpdate(id, dto.stock);
        }

        return product;
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.product.delete({ where: { id } });
    }
}
