import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToWishlistDto } from './dto';

@Injectable()
export class WishlistService {
    constructor(private prisma: PrismaService) { }

    async getWishlist(customerId: string) {
        let wishlist = await this.prisma.wishlist.findUnique({
            where: { customerId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!wishlist) {
            wishlist = await this.prisma.wishlist.create({
                data: {
                    customerId,
                },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    category: true
                                }
                            }
                        },
                    },
                },
            });
        }

        return wishlist;
    }

    async addToWishlist(customerId: string, dto: AddToWishlistDto) {
        // Verify product exists
        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Get or create wishlist
        let wishlist = await this.prisma.wishlist.findUnique({
            where: { customerId },
        });

        if (!wishlist) {
            wishlist = await this.prisma.wishlist.create({
                data: { customerId },
            });
        }

        // Check if item already in wishlist
        const existingItem = await this.prisma.wishlistItem.findUnique({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId: dto.productId,
                },
            },
        });

        if (!existingItem) {
            await this.prisma.wishlistItem.create({
                data: {
                    wishlistId: wishlist.id,
                    productId: dto.productId,
                },
            });
        }

        return this.getWishlist(customerId);
    }

    async removeFromWishlist(customerId: string, productId: string) {
        const wishlist = await this.prisma.wishlist.findUnique({
            where: { customerId },
        });

        if (!wishlist) {
            throw new NotFoundException('Wishlist not found');
        }

        await this.prisma.wishlistItem.deleteMany({
            where: {
                wishlistId: wishlist.id,
                productId,
            },
        });

        return this.getWishlist(customerId);
    }

    async clearWishlist(customerId: string) {
        const wishlist = await this.prisma.wishlist.findUnique({
            where: { customerId },
        });

        if (wishlist) {
            await this.prisma.wishlistItem.deleteMany({
                where: { wishlistId: wishlist.id },
            });
        }

        return this.getWishlist(customerId);
    }
}
