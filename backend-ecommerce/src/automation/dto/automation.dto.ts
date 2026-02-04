import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsJSON } from 'class-validator';

export class CreateAutomationRuleDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    trigger: string; // e.g., "ORDER_CREATED"

    @IsOptional()
    condition?: any;

    @IsNotEmpty()
    @IsString()
    action: string; // e.g., "NOTIFY_ADMIN"

    @IsOptional()
    @IsString()
    actionValue?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateAutomationRuleDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    trigger?: string;

    @IsOptional()
    condition?: any;

    @IsOptional()
    @IsString()
    action?: string;

    @IsOptional()
    @IsString()
    actionValue?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
