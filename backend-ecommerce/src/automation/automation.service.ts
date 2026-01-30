import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto';

@Injectable()
export class AutomationService {
    private readonly logger = new Logger(AutomationService.name);

    constructor(private prisma: PrismaService) { }

    async createRule(dto: CreateAutomationRuleDto, tenantId: string) {
        return this.prisma.automationRule.create({
            data: {
                ...dto,
                tenantId
            }
        });
    }

    async findAllRules(tenantId: string) {
        return this.prisma.automationRule.findMany({
            where: { tenantId },
            include: { _count: { select: { logs: true } } }
        });
    }

    async findOneRule(id: string, tenantId: string) {
        const rule = await this.prisma.automationRule.findFirst({
            where: { id, tenantId },
            include: { logs: { take: 10, orderBy: { createdAt: 'desc' } } }
        });
        if (!rule) throw new NotFoundException('Rule not found');
        return rule;
    }

    async updateRule(id: string, dto: UpdateAutomationRuleDto, tenantId: string) {
        await this.findOneRule(id, tenantId);
        return this.prisma.automationRule.update({
            where: { id },
            data: dto
        });
    }

    async removeRule(id: string, tenantId: string) {
        await this.findOneRule(id, tenantId);
        return this.prisma.automationRule.delete({ where: { id } });
    }

    async trigger(event: string, payload: any, tenantId: string) {
        this.logger.log(`Triggering automation event: ${event} for tenant: ${tenantId}`);

        const rules = await this.prisma.automationRule.findMany({
            where: { trigger: event, isActive: true, tenantId }
        });

        for (const rule of rules) {
            try {
                await this.executeAction(rule, payload);
                await this.logAutomation(rule.id, 'SUCCESS', { event, payload });
            } catch (error) {
                this.logger.error(`Failed to execute automation rule ${rule.name}: ${error.message}`);
                await this.logAutomation(rule.id, 'FAILED', { event, payload, error: error.message });
            }
        }
    }

    private async executeAction(rule: any, payload: any) {
        this.logger.log(`Executing action ${rule.action} for rule ${rule.name}`);
        // For simulation, we just log. Real implementation would involve other services.
    }

    private async logAutomation(ruleId: string, status: string, details: any) {
        await this.prisma.automationLog.create({
            data: {
                ruleId,
                status,
                details
            }
        });
    }
}
