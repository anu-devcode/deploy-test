import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Tenant } from '@prisma/client';
export declare class TenantsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.TenantCreateInput): Promise<Tenant>;
    findAll(): Promise<Tenant[]>;
    findOne(id: string): Promise<Tenant | null>;
    findBySlug(slug: string): Promise<Tenant | null>;
    update(id: string, data: Prisma.TenantUpdateInput): Promise<Tenant>;
    remove(id: string): Promise<Tenant>;
}
