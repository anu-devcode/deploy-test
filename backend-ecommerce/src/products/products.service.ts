import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { EventsGateway } from '../events/events.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway,
        private notificationsService: NotificationsService
    ) { }

    async create(dto: CreateProductDto) {
        const slug = (dto as any).slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
        const oldProduct = await this.findOne(id);
        const product = await this.prisma.product.update({
            where: { id },
            data: dto,
        });

        // Emit WebSocket Events
        this.eventsGateway.notifyProductUpdate(product);

        if (dto.stock !== undefined) {
            this.eventsGateway.notifyInventoryUpdate(id, dto.stock);

            // Low Stock / Out of Stock Alerts
            if (dto.stock === 0) {
                await this.notificationsService.create({
                    type: 'STOCK_ALERT' as any,
                    title: 'Product Out of Stock',
                    message: `${product.name} is now out of stock!`,
                    link: `/admin/products/${product.id}`,
                    targetRole: 'STAFF'
                });
            } else if (dto.stock <= 5) { // Assuming 5 as a default threshold for now
                await this.notificationsService.create({
                    type: 'STOCK_ALERT' as any,
                    title: 'Low Stock Alert',
                    message: `${product.name} has only ${dto.stock} items left.`,
                    link: `/admin/products/${product.id}`,
                    targetRole: 'STAFF'
                });
            }
        }

        // Price Update Alert for featured products
        if (dto.price !== undefined && oldProduct.isFeatured) {
            await this.notificationsService.create({
                type: 'INVENTORY' as any,
                title: 'Featured Product Price Updated',
                message: `Price for ${product.name} changed from ${oldProduct.price} to ${dto.price}.`,
                link: `/admin/products/${product.id}`,
                targetRole: 'ADMIN'
            });
        }

        return product;
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.product.delete({ where: { id } });
    }
}
