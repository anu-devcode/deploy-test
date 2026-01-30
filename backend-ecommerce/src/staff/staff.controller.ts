import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { TenantId } from '../common/decorators';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERADMIN)
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @Post()
    create(@Body() dto: CreateStaffDto, @TenantId() tenantId: string) {
        return this.staffService.create(dto, tenantId);
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.staffService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.staffService.findOne(id, tenantId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateStaffDto, @TenantId() tenantId: string) {
        return this.staffService.update(id, dto, tenantId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.staffService.remove(id, tenantId);
    }
}
