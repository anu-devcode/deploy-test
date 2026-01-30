import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto, UpdatePromotionDto, EvaluatePromotionDto } from './dto/promotion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant-id.decorator';

@Controller('promotions')
@UseGuards(JwtAuthGuard)
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) { }

    @Post()
    create(@TenantId() tenantId: string, @Body() createPromotionDto: CreatePromotionDto) {
        return this.promotionsService.create(tenantId, createPromotionDto);
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.promotionsService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.promotionsService.findOne(id, tenantId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @TenantId() tenantId: string, @Body() updatePromotionDto: UpdatePromotionDto) {
        return this.promotionsService.update(id, tenantId, updatePromotionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.promotionsService.remove(id, tenantId);
    }

    @Post('evaluate')
    evaluate(@TenantId() tenantId: string, @Body() evaluateDto: EvaluatePromotionDto) {
        return this.promotionsService.evaluate(tenantId, evaluateDto);
    }
}
