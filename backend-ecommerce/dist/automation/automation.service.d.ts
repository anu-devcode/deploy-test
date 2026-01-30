import { PrismaService } from '../prisma/prisma.service';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto';
export declare class AutomationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createRule(dto: CreateAutomationRuleDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        trigger: string;
        condition: import("@prisma/client/runtime/client").JsonValue | null;
        action: string;
        isActive: boolean;
    }>;
    findAllRules(tenantId: string): Promise<({
        _count: {
            logs: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        trigger: string;
        condition: import("@prisma/client/runtime/client").JsonValue | null;
        action: string;
        isActive: boolean;
    })[]>;
    findOneRule(id: string, tenantId: string): Promise<{
        logs: {
            id: string;
            createdAt: Date;
            status: string;
            ruleId: string;
            details: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        trigger: string;
        condition: import("@prisma/client/runtime/client").JsonValue | null;
        action: string;
        isActive: boolean;
    }>;
    updateRule(id: string, dto: UpdateAutomationRuleDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        trigger: string;
        condition: import("@prisma/client/runtime/client").JsonValue | null;
        action: string;
        isActive: boolean;
    }>;
    removeRule(id: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        name: string;
        trigger: string;
        condition: import("@prisma/client/runtime/client").JsonValue | null;
        action: string;
        isActive: boolean;
    }>;
    trigger(event: string, payload: any, tenantId: string): Promise<void>;
    private executeAction;
    private logAutomation;
}
