import { CmsService } from './cms.service';
import { CreateCmsPageDto, UpdateCmsPageDto } from './dto';
export declare class CmsController {
    private readonly cmsService;
    constructor(cmsService: CmsService);
    create(dto: CreateCmsPageDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        slug: string;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        slug: string;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }[]>;
    findOne(slug: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        slug: string;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
    update(id: string, dto: UpdateCmsPageDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        slug: string;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
    remove(id: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        slug: string;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
}
