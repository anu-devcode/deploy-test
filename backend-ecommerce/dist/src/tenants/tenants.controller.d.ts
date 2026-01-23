import { TenantsService } from './tenants.service';
import { Prisma } from '@prisma/client';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(createTenantDto: Prisma.TenantCreateInput): Promise<{
        name: string;
        id: string;
        slug: string;
        config: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        slug: string;
        config: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        slug: string;
        config: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(id: string, updateTenantDto: Prisma.TenantUpdateInput): Promise<{
        name: string;
        id: string;
        slug: string;
        config: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        slug: string;
        config: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
