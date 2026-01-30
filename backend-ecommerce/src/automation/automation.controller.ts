import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto';
import { RolesGuard, JwtAuthGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { TenantId } from '../common/decorators';

@Controller('automation')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERADMIN)
export class AutomationController {
    constructor(private readonly automationService: AutomationService) { }

    @Post('rules')
    create(@Body() dto: CreateAutomationRuleDto, @TenantId() tenantId: string) {
        return this.automationService.createRule(dto, tenantId);
    }

    @Get('rules')
    findAll(@TenantId() tenantId: string) {
        return this.automationService.findAllRules(tenantId);
    }

    @Get('rules/:id')
    findOne(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.automationService.findOneRule(id, tenantId);
    }

    @Patch('rules/:id')
    update(@Param('id') id: string, @Body() dto: UpdateAutomationRuleDto, @TenantId() tenantId: string) {
        return this.automationService.updateRule(id, dto, tenantId);
    }

    @Delete('rules/:id')
    remove(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.automationService.removeRule(id, tenantId);
    }
}
