import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CustomersService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
    ) { }

    async create(dto: CreateCustomerDto) {
        // Check if customer with same email exists
        const existing = await this.prisma.customer.findFirst({
            where: { email: dto.email },
        });

        if (existing) {
            throw new ConflictException('Customer with this email already exists');
        }

        return this.prisma.customer.create({
            data: {
                ...dto,
            },
        });
    }

    async findAll(role: string) {
        const customers = await this.prisma.customer.findMany({
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

    async findOne(id: string, role: string) {
        const customer = await this.prisma.customer.findFirst({
            where: { id },
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

    async findByEmail(email: string) {
        return this.prisma.customer.findFirst({
            where: { email },
        });
    }

    async update(id: string, dto: UpdateCustomerDto) {
        await this.findOne(id, 'ADMIN');

        // Check email uniqueness if email is being updated
        if (dto.email) {
            const existing = await this.prisma.customer.findFirst({
                where: {
                    email: dto.email,
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

    async remove(id: string) {
        await this.findOne(id, 'ADMIN');
        return this.prisma.customer.delete({ where: { id } });
    }

    async getProfile(customerId: string) {
        const customer = await this.prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                _count: {
                    select: { orders: true }
                },
                addresses: true
            }
        });
        if (!customer) {
            throw new NotFoundException('Profile not found');
        }
        return this.sanitizeCustomer(customer, 'CUSTOMER');
    }

    async updateProfile(customerId: string, dto: UpdateCustomerDto) {
        await this.getProfile(customerId);

        let firstName = dto.firstName;
        let lastName = dto.lastName;

        if (dto.name && !firstName && !lastName) {
            const parts = dto.name.trim().split(/\s+/);
            firstName = parts[0];
            lastName = parts.slice(1).join(' ') || '';
        }

        // Update User model FIRST to ensure sync
        await this.prisma.user.update({
            where: { id: customerId },
            data: {
                firstName: firstName !== undefined ? firstName : undefined,
                lastName: lastName !== undefined ? lastName : undefined,
            } as any
        });

        // Then update Customer model
        return this.prisma.customer.update({
            where: { id: customerId },
            data: {
                firstName: firstName !== undefined ? firstName : undefined,
                lastName: lastName !== undefined ? lastName : undefined,
                phone: dto.phone,
                avatar: dto.avatar,
            } as any
        });
    }

    // Address Management
    async getAddresses(customerId: string) {
        return this.prisma.customerAddress.findMany({
            where: { customerId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async addAddress(customerId: string, dto: any) {
        // If this is the first address, make it default
        const count = await this.prisma.customerAddress.count({ where: { customerId } });
        const isDefault = count === 0 ? true : (dto.isDefault || false);

        // If new address is default, unset other defaults
        if (isDefault) {
            await this.prisma.customerAddress.updateMany({
                where: { customerId, isDefault: true },
                data: { isDefault: false }
            });
        }

        return this.prisma.customerAddress.create({
            data: {
                ...dto,
                isDefault,
                customerId
            }
        });
    }

    async deleteAddress(customerId: string, addressId: string) {
        const address = await this.prisma.customerAddress.findFirst({
            where: { id: addressId, customerId }
        });

        if (!address) throw new NotFoundException('Address not found');

        return this.prisma.customerAddress.delete({
            where: { id: addressId }
        });
    }

    async setAddressDefault(customerId: string, addressId: string) {
        await this.prisma.customerAddress.updateMany({
            where: { customerId, isDefault: true },
            data: { isDefault: false }
        });

        return this.prisma.customerAddress.update({
            where: { id: addressId },
            data: { isDefault: true }
        });
    }

    async getBillingInfo(customerId: string) {
        const [customer, savedMethods] = await Promise.all([
            this.getProfile(customerId),
            this.getSavedPaymentMethods(customerId)
        ]);

        const defaultAddress = customer.addresses?.find((a: any) => a.isDefault) || customer.addresses?.[0];

        return {
            savedMethods,
            billingAddress: {
                address: defaultAddress?.street || '',
                city: defaultAddress?.city || '',
                country: 'Ethiopia',
            }
        };
    }

    // Payment Method Management
    async getSavedPaymentMethods(customerId: string) {
        return this.prisma.savedPaymentMethod.findMany({
            where: { customerId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async addSavedPaymentMethod(customerId: string, dto: any) {
        const count = await this.prisma.savedPaymentMethod.count({ where: { customerId } });
        const isDefault = count === 0 ? true : (dto.isDefault || false);

        if (isDefault) {
            await this.prisma.savedPaymentMethod.updateMany({
                where: { customerId, isDefault: true },
                data: { isDefault: false }
            });
        }

        return this.prisma.savedPaymentMethod.create({
            data: {
                ...dto,
                isDefault,
                customerId
            }
        });
    }

    async deleteSavedPaymentMethod(customerId: string, methodId: string) {
        const method = await this.prisma.savedPaymentMethod.findFirst({
            where: { id: methodId, customerId }
        });

        if (!method) throw new NotFoundException('Payment method not found');

        return this.prisma.savedPaymentMethod.delete({
            where: { id: methodId }
        });
    }

    async setSavedPaymentMethodDefault(customerId: string, methodId: string) {
        const method = await this.prisma.savedPaymentMethod.findFirst({
            where: { id: methodId, customerId }
        });

        if (!method) throw new NotFoundException('Payment method not found');

        await this.prisma.savedPaymentMethod.updateMany({
            where: { customerId, isDefault: true },
            data: { isDefault: false }
        });

        return this.prisma.savedPaymentMethod.update({
            where: { id: methodId },
            data: { isDefault: true }
        });
    }

    async getInvoices(customerId: string) {
        const orders = await this.prisma.order.findMany({
            where: { customerId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                orderNumber: true,
                total: true,
                status: true,
                paymentStatus: true,
                createdAt: true,
            }
        });
        return orders;
    }

    private sanitizeCustomer(customer: any, role: string) {
        if (role !== 'ADMIN') {
            const { adminNotes, flags, ...safeCustomer } = customer;
            return safeCustomer;
        }
        return customer;
    }

    async getCustomerStats() {
        const [totalCustomers, customersThisMonth] = await Promise.all([
            this.prisma.customer.count(),
            this.prisma.customer.count({
                where: {
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

    async requestDataExport(customerId: string) {
        const customer = await this.getProfile(customerId);

        // Notify Admins
        await this.notificationsService.create({
            type: 'ACCOUNT' as any,
            title: 'GDPR Data Export Requested',
            message: `Customer ${customer.firstName} ${customer.lastName} (${customer.email}) has requested a full data export.`,
            link: `/admin/customers/${customerId}`,
            targetRole: 'ADMIN'
        });

        // Optionally create a task/flag in DB
        await this.prisma.customer.update({
            where: { id: customerId },
            data: {
                flags: { push: 'DATA_EXPORT_REQUESTED' }
            } as any
        });

        return { message: 'Data export request submitted successfully. Our team will contact you shortly.' };
    }
}
