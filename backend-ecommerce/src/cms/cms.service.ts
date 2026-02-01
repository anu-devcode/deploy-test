import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCmsPageDto, UpdateCmsPageDto } from './dto';

@Injectable()
export class CmsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCmsPageDto) {
        const existing = await this.prisma.cmsPage.findFirst({
            where: { slug: dto.slug },
        });

        if (existing) {
            throw new ConflictException('Page with this slug already exists');
        }

        return this.prisma.cmsPage.create({
            data: {
                ...dto,
            },
        });
    }

    async findAll() {
        return this.prisma.cmsPage.findMany({
            orderBy: { updatedAt: 'desc' },
        });
    }

    async findOne(slug: string) {
        const page = await this.prisma.cmsPage.findFirst({
            where: { slug },
        });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        return page;
    }

    async update(id: string, dto: UpdateCmsPageDto) {
        const page = await this.prisma.cmsPage.findFirst({
            where: { id },
        });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        return this.prisma.cmsPage.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        const page = await this.prisma.cmsPage.findFirst({
            where: { id },
        });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        return this.prisma.cmsPage.delete({ where: { id } });
    }
}
