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
exports.DeliveryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DeliveryService = class DeliveryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        const order = await this.prisma.order.findFirst({
            where: { id: dto.orderId, tenantId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return this.prisma.delivery.create({
            data: {
                orderId: dto.orderId,
                driverName: dto.driverName,
                driverPhone: dto.driverPhone,
                vehicleInfo: dto.vehicleInfo,
                estimatedTime: dto.estimatedTime ? new Date(dto.estimatedTime) : undefined,
                notes: dto.notes,
                tenantId,
            },
            include: { order: true },
        });
    }
    async findAll(tenantId) {
        return this.prisma.delivery.findMany({
            where: { tenantId },
            include: { order: { include: { customer: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, tenantId) {
        const delivery = await this.prisma.delivery.findFirst({
            where: { id, tenantId },
            include: { order: { include: { customer: true, items: { include: { product: true } } } } },
        });
        if (!delivery) {
            throw new common_1.NotFoundException('Delivery not found');
        }
        return delivery;
    }
    async findByOrder(orderId, tenantId) {
        return this.prisma.delivery.findFirst({
            where: { orderId, tenantId },
            include: { order: true },
        });
    }
    async update(id, dto, tenantId) {
        await this.findOne(id, tenantId);
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
    async updateStatus(id, status, tenantId) {
        await this.findOne(id, tenantId);
        const data = { status };
        if (status === 'DELIVERED') {
            data.actualDelivery = new Date();
        }
        return this.prisma.delivery.update({
            where: { id },
            data,
            include: { order: true },
        });
    }
};
exports.DeliveryService = DeliveryService;
exports.DeliveryService = DeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeliveryService);
//# sourceMappingURL=delivery.service.js.map