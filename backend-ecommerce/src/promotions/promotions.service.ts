import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto, UpdatePromotionDto, EvaluatePromotionDto } from './dto/promotion.dto';
import { PromotionTarget, PromotionType, PromoBusinessType } from '@prisma/client';

@Injectable()
export class PromotionsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreatePromotionDto) {
        return this.prisma.promotion.create({
            data: {
                ...dto,
            },
        });
    }

    async findAll() {
        return this.prisma.promotion.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const promo = await this.prisma.promotion.findFirst({
            where: { id },
        });
        if (!promo) throw new NotFoundException('Promotion not found');
        return promo;
    }

    async update(id: string, dto: UpdatePromotionDto) {
        await this.findOne(id);
        return this.prisma.promotion.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.promotion.delete({
            where: { id },
        });
    }

    async evaluate(dto: EvaluatePromotionDto) {
        const { code, items, businessType } = dto;
        const now = new Date();

        // 1. Find the applicable promotion
        let promo = null;
        if (code) {
            promo = await this.prisma.promotion.findFirst({
                where: {
                    code,
                    isActive: true,
                    OR: [
                        { startDate: null },
                        { startDate: { lte: now } },
                    ],
                    AND: [
                        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
                    ],
                },
            });
            if (!promo) throw new BadRequestException('Invalid or expired promotion code');
            if (promo.usageLimit !== null && promo.currentUsage >= promo.usageLimit) {
                throw new BadRequestException('Promotion usage limit reached');
            }
        }

        // Filter by business type if businessType is BOTH, or matches exactly
        if (promo && promo.businessType !== 'BOTH' && promo.businessType !== businessType) {
            throw new BadRequestException(`This promotion is only available for ${promo.businessType.toLowerCase()} users`);
        }

        // 2. Calculate discounts
        let totalDiscount = 0;
        const itemDiscounts = items.map(item => {
            let discount = 0;
            if (promo) {
                const isProductTarget = promo.target === PromotionTarget.PRODUCT && promo.targetIds.includes(item.productId);
                const isCategoryTarget = promo.target === PromotionTarget.CATEGORY && promo.targetIds.includes(item.categoryId);

                if (isProductTarget || isCategoryTarget) {
                    if (promo.type === PromotionType.PERCENTAGE) {
                        discount = (item.price * Number(promo.value) / 100) * item.quantity;
                    } else if (promo.type === PromotionType.FIXED_AMOUNT) {
                        // Distribute fixed amount? Usually PRODUCT level fixed is per unit or total.
                        // Requirement says "deterministic discount calculation".
                        // Let's assume for fixed_amount on PRODUCT level, it's per unit for simplicity or total.
                        // Let's go with per unit if target is PRODUCT/CATEGORY. 
                        discount = Number(promo.value) * item.quantity;
                    }
                }
            }
            return { productId: item.productId, discount };
        });

        totalDiscount = itemDiscounts.reduce((sum, item) => sum + item.discount, 0);

        // 3. Cart-level discount
        if (promo && promo.target === PromotionTarget.CART) {
            const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (subtotal >= Number(promo.minAmount)) {
                if (promo.type === PromotionType.PERCENTAGE) {
                    totalDiscount = (subtotal * Number(promo.value) / 100);
                } else {
                    totalDiscount = Number(promo.value);
                }
            } else {
                throw new BadRequestException(`Minimum spend of ${promo.minAmount} required for this promotion`);
            }
        }

        return {
            promoId: promo?.id,
            totalDiscount,
            itemDiscounts: promo?.target !== PromotionTarget.CART ? itemDiscounts : [],
        };
    }
}
