import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CampaignType, CampaignStatus, MarketingAssetType } from '@prisma/client';
import { randomBytes } from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class MarketingService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
        private notificationsService: NotificationsService,
    ) { }

    async createCampaign(data: { name: string; subject: string; content: string; type: CampaignType; scheduledAt?: Date }) {
        return this.prisma.emailCampaign.create({
            data: {
                ...data,
                status: data.scheduledAt ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
            }
        });
    }

    async findAllCampaigns() {
        return this.prisma.emailCampaign.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOneCampaign(id: string) {
        const campaign = await this.prisma.emailCampaign.findUnique({
            where: { id }
        });
        if (!campaign) throw new NotFoundException('Campaign not found');
        return campaign;
    }

    async updateCampaign(id: string, data: { name?: string; subject?: string; content?: string; type?: CampaignType; status?: CampaignStatus }) {
        await this.findOneCampaign(id);
        return this.prisma.emailCampaign.update({
            where: { id },
            data
        });
    }

    async sendCampaign(id: string) {
        const campaign = await this.findOneCampaign(id);

        if (campaign.status === CampaignStatus.SENT || campaign.status === CampaignStatus.SENDING) {
            throw new BadRequestException('Campaign is already sent or sending');
        }

        // Update status to SENDING
        await this.prisma.emailCampaign.update({
            where: { id },
            data: { status: CampaignStatus.SENDING, sentAt: new Date() }
        });

        // Get recipients who opted in
        const recipients = await this.prisma.emailPreference.findMany({
            where: { marketing: true }
        });

        let sentCount = 0;

        // Send emails asynchronously (in real app, use a queue)
        // For now, we process in chunks to avoid blocking too long, but still naive
        for (const recipient of recipients) {
            try {
                await this.emailService.sendPromotionalEmail(
                    recipient.email,
                    campaign.subject,
                    campaign.content,
                    recipient.unsubscribeToken
                );
                sentCount++;
            } catch (e) {
                console.error(`Failed to send campaign to ${recipient.email}: `, e);
            }
        }

        // Send in-app notifications to all matching customers
        const optedInCustomers = await this.prisma.customer.findMany({
            where: {
                email: { in: recipients.map(r => r.email) }
            }
        });

        for (const customer of optedInCustomers) {
            await this.notificationsService.create({
                customerId: customer.id,
                type: 'PROMOTION' as any,
                title: campaign.subject,
                message: campaign.name,
                link: '/shop'
            });
        }

        // Update status to SENT and count
        return this.prisma.emailCampaign.update({
            where: { id },
            data: {
                status: CampaignStatus.SENT,
                sentCount,
            }
        });
    }

    // Preferences
    async getPreferences(email: string) {
        let prefs = await this.prisma.emailPreference.findUnique({
            where: { email }
        });

        if (!prefs) {
            // Create default if not exists
            prefs = await this.prisma.emailPreference.create({
                data: { email }
            });
        }
        return prefs;
    }

    async updatePreferences(email: string, data: { marketing?: boolean; orderUpdates?: boolean; productUpdates?: boolean }) {
        const prefs = await this.getPreferences(email);
        return this.prisma.emailPreference.update({
            where: { id: prefs.id },
            data
        });
    }

    async unsubscribe(token: string) {
        const prefs = await this.prisma.emailPreference.findUnique({
            where: { unsubscribeToken: token }
        });

        if (!prefs) throw new NotFoundException('Invalid unsubscribe link');

        return this.prisma.emailPreference.update({
            where: { id: prefs.id },
            data: { marketing: false, productUpdates: false }
        });
    }

    // Marketing Assets (Cards, Flyers, QR Codes)
    async createAsset(data: {
        type: MarketingAssetType;
        name: string;
        productId?: string;
        title?: string;
        description?: string;
        promoCode?: string;
        qrLink: string;
        template?: string;
        config?: any;
    }) {
        // Sanitize optional fields: treat empty strings as null/undefined for Prisma
        const sanitizedData = {
            ...data,
            productId: data.productId || undefined,
            promoCode: data.promoCode || undefined,
            title: data.title || undefined,
            description: data.description || undefined,
            template: data.template || undefined,
        };

        return this.prisma.marketingAsset.create({
            data: sanitizedData,
            include: { product: true }
        });
    }

    async findAllAssets() {
        return this.prisma.marketingAsset.findMany({
            include: { product: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async deleteAsset(id: string) {
        return this.prisma.marketingAsset.delete({
            where: { id }
        });
    }

    async generateQRCode(url: string): Promise<string> {
        try {
            return await QRCode.toDataURL(url, {
                width: 512,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            });
        } catch (err) {
            throw new BadRequestException('Failed to generate QR code');
        }
    }
}
