import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto';

@Injectable()
export class AutomationService {
    private readonly logger = new Logger(AutomationService.name);

    constructor(private prisma: PrismaService) { }

    async createRule(dto: CreateAutomationRuleDto) {
        return this.prisma.automationRule.create({
            data: {
                ...dto,
            }
        });
    }

    async findAllRules() {
        return this.prisma.automationRule.findMany({
            include: { _count: { select: { logs: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOneRule(id: string) {
        const rule = await this.prisma.automationRule.findFirst({
            where: { id },
            include: { logs: { take: 10, orderBy: { createdAt: 'desc' } } }
        });
        if (!rule) throw new NotFoundException('Rule not found');
        return rule;
    }

    async findAllLogs() {
        return this.prisma.automationLog.findMany({
            include: { rule: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
            take: 100
        }).then(logs => logs.map(log => ({
            ...log,
            ruleName: log.rule?.name || 'Deleted Rule'
        })));
    }

    async updateRule(id: string, dto: UpdateAutomationRuleDto) {
        await this.findOneRule(id);
        return this.prisma.automationRule.update({
            where: { id },
            data: dto
        });
    }

    async removeRule(id: string) {
        await this.findOneRule(id);
        return this.prisma.automationRule.delete({ where: { id } });
    }

    async trigger(event: string, payload: any) {
        this.logger.log(`Triggering automation event: ${event}`);

        const rules = await this.prisma.automationRule.findMany({
            where: { trigger: event, isActive: true }
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
