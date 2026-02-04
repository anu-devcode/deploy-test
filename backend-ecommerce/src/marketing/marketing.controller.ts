import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { CampaignType, MarketingAssetType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('marketing')
export class MarketingController {
    constructor(private readonly marketingService: MarketingService) { }

    @Get('campaigns')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    findAll() {
        return this.marketingService.findAllCampaigns();
    }

    @Get('campaigns/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    findOne(@Param('id') id: string) {
        return this.marketingService.findOneCampaign(id);
    }

    @Post('campaigns')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    create(@Body() data: { name: string; subject: string; content: string; type: CampaignType; scheduledAt?: string }) {
        return this.marketingService.createCampaign({
            ...data,
            scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        });
    }

    @Post('campaigns/:id/send')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    send(@Param('id') id: string) {
        return this.marketingService.sendCampaign(id);
    }

    @Get('preferences')
    getPreferences(@Query('email') email: string) {
        return this.marketingService.getPreferences(email);
    }

    @Post('preferences')
    updatePreferences(@Body() body: { email: string; marketing?: boolean; orderUpdates?: boolean; productUpdates?: boolean }) {
        return this.marketingService.updatePreferences(body.email, {
            marketing: body.marketing,
            orderUpdates: body.orderUpdates,
            productUpdates: body.productUpdates,
        });
    }

    @Get('unsubscribe')
    unsubscribe(@Query('token') token: string) {
        return this.marketingService.unsubscribe(token);
    }

    // Marketing Assets (Cards, Flyers, QR Codes)
    @Get('assets')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    findAllAssets() {
        return this.marketingService.findAllAssets();
    }

    @Post('assets')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    createAsset(@Body() data: {
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
        return this.marketingService.createAsset(data);
    }

    @Delete('assets/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    deleteAsset(@Param('id') id: string) {
        return this.marketingService.deleteAsset(id);
    }

    @Get('qr')
    @UseGuards(JwtAuthGuard)
    async getQRCode(@Query('url') url: string) {
        const qrCode = await this.marketingService.generateQRCode(url);
        return { qrCode };
    }
}
