import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCmsPageDto, UpdateCmsPageDto } from './dto';

@Injectable()
export class CmsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCmsPageDto, tenantId: string) {
        const existing = await this.prisma.cmsPage.findFirst({
            where: { slug: dto.slug, tenantId },
        });

        if (existing) {
            throw new ConflictException('Page with this slug already exists');
        }

        return this.prisma.cmsPage.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.cmsPage.findMany({
            where: { tenantId },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async findOne(slug: string, tenantId: string) {
        const page = await this.prisma.cmsPage.findFirst({
            where: { slug, tenantId },
        });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        return page;
    }

    async update(id: string, dto: UpdateCmsPageDto, tenantId: string) {
        const page = await this.prisma.cmsPage.findFirst({
            where: { id, tenantId },
        });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        return this.prisma.cmsPage.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, tenantId: string) {
        const page = await this.prisma.cmsPage.findFirst({
            where: { id, tenantId },
        });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        return this.prisma.cmsPage.delete({ where: { id } });
    }
}
