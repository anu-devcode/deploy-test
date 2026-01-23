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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const Decimal = client_1.Prisma.Decimal;
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        const productIds = dto.items.map((item) => item.productId);
        const products = await this.prisma.product.findMany({
            where: {
                id: { in: productIds },
                tenantId,
            },
        });
        if (products.length !== productIds.length) {
            throw new common_1.BadRequestException('One or more products not found');
        }
        let total = new Decimal(0);
        const orderItems = dto.items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product)
                throw new common_1.BadRequestException('Product not found');
            const itemTotal = product.price.mul(item.quantity);
            total = total.add(itemTotal);
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            };
        });
        return this.prisma.order.create({
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
    }
    async findAll(tenantId) {
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
    async findOne(id, tenantId) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateStatus(id, status, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
        return this.prisma.order.delete({ where: { id } });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map