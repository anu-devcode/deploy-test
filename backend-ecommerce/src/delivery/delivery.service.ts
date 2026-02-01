import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto, UpdateDeliveryDto } from './dto';

@Injectable()
export class DeliveryService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateDeliveryDto) {
        // Verify order exists
        const order = await this.prisma.order.findFirst({
            where: { id: dto.orderId },
        });
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return this.prisma.delivery.create({
            data: {
                orderId: dto.orderId,
                driverName: dto.driverName,
                driverPhone: dto.driverPhone,
                vehicleInfo: dto.vehicleInfo,
                estimatedTime: dto.estimatedTime ? new Date(dto.estimatedTime) : undefined,
                notes: dto.notes,
            },
            include: { order: true },
        });
    }

    async findAll() {
        return this.prisma.delivery.findMany({
            include: { order: { include: { customer: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const delivery = await this.prisma.delivery.findFirst({
            where: { id },
            include: { order: { include: { customer: true, items: { include: { product: true } } } } },
        });
        if (!delivery) {
            throw new NotFoundException('Delivery not found');
        }
        return delivery;
    }

    async findByOrder(orderId: string) {
        return this.prisma.delivery.findFirst({
            where: { orderId },
            include: { order: true },
        });
    }

    async update(id: string, dto: UpdateDeliveryDto) {
        await this.findOne(id);

        return this.prisma.delivery.update({
            where: { id },
            data: {
                status: dto.status,
                driverName: dto.driverName,
                driverPhone: dto.driverPhone,
                vehicleInfo: dto.vehicleInfo,
                estimatedTime: dto.estimatedTime ? new Date(dto.estimatedTime) : undefined,
                actualDelivery: dto.actualDelivery ? new Date(dto.actualDelivery) : undefined,
                notes: dto.notes,
            },
            include: { order: true },
        });
    }

    async updateStatus(id: string, status: string) {
        await this.findOne(id);

        const data: any = { status };
        if (status === 'DELIVERED') {
            data.actualDelivery = new Date();
        }

        return this.prisma.delivery.update({
            where: { id },
            data,
            include: { order: true },
        });
    }
}
