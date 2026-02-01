import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto, UpdatePromotionDto, EvaluatePromotionDto } from './dto/promotion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('promotions')
@UseGuards(JwtAuthGuard)
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) { }

    @Post()
    create(@Body() createPromotionDto: CreatePromotionDto) {
        return this.promotionsService.create(createPromotionDto);
    }

    @Get()
    findAll() {
        return this.promotionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.promotionsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
        return this.promotionsService.update(id, updatePromotionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.promotionsService.remove(id);
    }

    @Post('evaluate')
    evaluate(@Body() evaluateDto: EvaluatePromotionDto) {
        return this.promotionsService.evaluate(evaluateDto);
    }
}
