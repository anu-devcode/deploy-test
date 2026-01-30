import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCustomerDto, tenantId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        address: string | null;
        city: string | null;
        country: string | null;
        adminNotes: string | null;
        flags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    findAll(tenantId: string, role: string): Promise<any[]>;
    findOne(id: string, tenantId: string, role: string): Promise<any>;
    findByEmail(email: string, tenantId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        address: string | null;
        city: string | null;
        country: string | null;
        adminNotes: string | null;
        flags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    } | null>;
    update(id: string, dto: UpdateCustomerDto, tenantId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        address: string | null;
        city: string | null;
        country: string | null;
        adminNotes: string | null;
        flags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    remove(id: string, tenantId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        address: string | null;
        city: string | null;
        country: string | null;
        adminNotes: string | null;
        flags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    private sanitizeCustomer;
    getCustomerStats(tenantId: string): Promise<{
        totalCustomers: number;
        customersThisMonth: number;
    }>;
}
