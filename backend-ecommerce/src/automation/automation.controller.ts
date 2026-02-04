import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto';
import { RolesGuard, JwtAuthGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('automations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERADMIN)
export class AutomationController {
    constructor(private readonly automationService: AutomationService) { }

    @Post('rules')
    create(@Body() dto: CreateAutomationRuleDto) {
        return this.automationService.createRule(dto);
    }

    @Get('rules')
    findAll() {
        return this.automationService.findAllRules();
    }

    @Get('logs')
    findAllLogs() {
        return this.automationService.findAllLogs();
    }

    @Get('rules/:id')
    findOne(@Param('id') id: string) {
        return this.automationService.findOneRule(id);
    }

    @Patch('rules/:id')
    update(@Param('id') id: string, @Body() dto: UpdateAutomationRuleDto) {
        return this.automationService.updateRule(id, dto);
    }

    @Delete('rules/:id')
    remove(@Param('id') id: string) {
        return this.automationService.removeRule(id);
    }
}
