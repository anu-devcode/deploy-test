import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERADMIN)
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @Post()
    create(@Body() dto: CreateStaffDto) {
        return this.staffService.create(dto);
    }

    @Get()
    findAll() {
        return this.staffService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.staffService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
        return this.staffService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.staffService.remove(id);
    }
}
