import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateCategoryDto) {
        // Check for duplicate slug in same parent context
        const existing = await this.prisma.category.findFirst({
            where: { slug: dto.slug, parentId: dto.parentId || null },
        });
        if (existing) {
            throw new ConflictException('Category with this slug already exists');
        }

        return this.prisma.category.create({
            data: {
                name: dto.name,
                slug: dto.slug,
                description: dto.description,
                parentId: dto.parentId,
            },
            include: { parent: true, children: true },
        });
    }

    async findAll() {
        return this.prisma.category.findMany({
            where: { parentId: null },
            include: {
                children: {
                    include: { children: true },
                },
                _count: { select: { products: true } },
            },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
                products: { take: 10 },
            },
        });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async update(id: string, dto: UpdateCategoryDto) {
        await this.findOne(id);

        if (dto.slug) {
            const existing = await this.prisma.category.findFirst({
                where: { slug: dto.slug, parentId: dto.parentId || null, id: { not: id } },
            });
            if (existing) {
                throw new ConflictException('Category with this slug already exists');
            }
        }

        return this.prisma.category.update({
            where: { id },
            data: {
                name: dto.name,
                slug: dto.slug,
                description: dto.description,
                parentId: dto.parentId,
            },
            include: { parent: true, children: true },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.category.delete({ where: { id } });
    }
}
