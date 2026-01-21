import { PrismaService } from '../prisma/prisma.service';
import { CreateCmsPageDto, UpdateCmsPageDto } from './dto';
export declare class CmsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCmsPageDto, tenantId: string): Promise<{
        tenantId: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
    findAll(tenantId: string): Promise<{
        tenantId: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }[]>;
    findOne(slug: string, tenantId: string): Promise<{
        tenantId: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
    update(id: string, dto: UpdateCmsPageDto, tenantId: string): Promise<{
        tenantId: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
    remove(id: string, tenantId: string): Promise<{
        tenantId: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
}
