import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';

@Injectable()
export class CustomersService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCustomerDto, tenantId: string) {
        // Check if customer with same email exists in tenant
        const existing = await this.prisma.customer.findFirst({
            where: { email: dto.email, tenantId },
        });

        if (existing) {
            throw new ConflictException('Customer with this email already exists');
        }

        return this.prisma.customer.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string, role: string) {
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

    async findOne(id: string, tenantId: string, role: string) {
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
            throw new NotFoundException('Customer not found');
        }

        return this.sanitizeCustomer(customer, role);
    }

    async findByEmail(email: string, tenantId: string) {
        return this.prisma.customer.findFirst({
            where: { email, tenantId },
        });
    }

    async update(id: string, dto: UpdateCustomerDto, tenantId: string) {
        await this.findOne(id, tenantId, 'ADMIN');

        // Check email uniqueness if email is being updated
        if (dto.email) {
            const existing = await this.prisma.customer.findFirst({
                where: {
                    email: dto.email,
                    tenantId,
                    NOT: { id },
                },
            });

            if (existing) {
                throw new ConflictException('Another customer with this email already exists');
            }
        }

        return this.prisma.customer.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId, 'ADMIN');
        return this.prisma.customer.delete({ where: { id } });
    }

    private sanitizeCustomer(customer: any, role: string) {
        if (role !== 'ADMIN') {
            const { adminNotes, flags, ...safeCustomer } = customer;
            return safeCustomer;
        }
        return customer;
    }

    async getCustomerStats(tenantId: string) {
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
}
