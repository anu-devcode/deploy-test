import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto';
import { OrderStatus, Prisma } from '@prisma/client';
import { AutomationService } from '../automation/automation.service';
const Decimal = Prisma.Decimal;

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private automationService: AutomationService
    ) { }

    async create(dto: CreateOrderDto, tenantId: string) {
        // Fetch products and validate
        const productIds = dto.items.map((item) => item.productId);
        const products = await this.prisma.product.findMany({
            where: {
                id: { in: productIds },
                tenantId,
            },
        });

        if (products.length !== productIds.length) {
            throw new BadRequestException('One or more products not found');
        }

        // Calculate total
        let total = new Decimal(0);
        const orderItems = dto.items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) throw new BadRequestException('Product not found');
            const itemTotal = product.price.mul(item.quantity);
            total = total.add(itemTotal);
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            };
        });

        const order = await this.prisma.order.create({
            data: {
                customerId: dto.customerId,
                tenantId,
                total,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Trigger Automation
        await this.automationService.trigger('ORDER_CREATED', order, tenantId);

        return order;
    }

    async findAll(tenantId: string) {
        return this.prisma.order.findMany({
            where: { tenantId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
            },
        });
    }

    async findOne(id: string, tenantId: string) {
        const order = await this.prisma.order.findFirst({
            where: { id, tenantId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async updateStatus(id: string, status: OrderStatus, tenantId: string) {
        await this.findOne(id, tenantId);
        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId);
        // First delete order items
        await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
        return this.prisma.order.delete({ where: { id } });
    }
}
