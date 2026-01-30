import { AutomationService } from './automation.service';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto';
export declare class AutomationController {
    private readonly automationService;
    constructor(automationService: AutomationService);
    create(dto: CreateAutomationRuleDto, tenantId: string): Promise<{
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
    findAll(tenantId: string): Promise<({
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
    findOne(id: string, tenantId: string): Promise<{
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
    update(id: string, dto: UpdateAutomationRuleDto, tenantId: string): Promise<{
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
    remove(id: string, tenantId: string): Promise<{
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
}
