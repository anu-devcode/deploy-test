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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomersService = class CustomersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        const existing = await this.prisma.customer.findFirst({
            where: { email: dto.email, tenantId },
        });
        if (existing) {
            throw new common_1.ConflictException('Customer with this email already exists');
        }
        return this.prisma.customer.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }
    async findAll(tenantId, role) {
        const customers = await this.prisma.customer.findMany({
            where: { tenantId },
            include: {
                orders: {
                    select: {
                        id: true,
                        total: true,
                        status: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
                _count: {
                    select: { orders: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return customers.map(c => this.sanitizeCustomer(c, role));
    }
    async findOne(id, tenantId, role) {
        const customer = await this.prisma.customer.findFirst({
            where: { id, tenantId },
            include: {
                orders: {
                    include: {
                        items: {
                            include: { product: true },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                cart: {
                    include: {
                        items: {
                            include: { product: true },
                        },
                    },
                },
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return this.sanitizeCustomer(customer, role);
    }
    async findByEmail(email, tenantId) {
        return this.prisma.customer.findFirst({
            where: { email, tenantId },
        });
    }
    async update(id, dto, tenantId) {
        await this.findOne(id, tenantId, 'ADMIN');
        if (dto.email) {
            const existing = await this.prisma.customer.findFirst({
                where: {
                    email: dto.email,
                    tenantId,
                    NOT: { id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Another customer with this email already exists');
            }
        }
        return this.prisma.customer.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId, 'ADMIN');
        return this.prisma.customer.delete({ where: { id } });
    }
    sanitizeCustomer(customer, role) {
        if (role !== 'ADMIN') {
            const { adminNotes, flags, ...safeCustomer } = customer;
            return safeCustomer;
        }
        return customer;
    }
    async getCustomerStats(tenantId) {
        const [totalCustomers, customersThisMonth] = await Promise.all([
            this.prisma.customer.count({ where: { tenantId } }),
            this.prisma.customer.count({
                where: {
                    tenantId,
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
        ]);
        return {
            totalCustomers,
            customersThisMonth,
        };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map