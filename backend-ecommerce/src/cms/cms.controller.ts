import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CmsService } from './cms.service';
import { CreateCmsPageDto, UpdateCmsPageDto } from './dto';
import { TenantId } from '../common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('cms')
export class CmsController {
    constructor(private readonly cmsService: CmsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Body() dto: CreateCmsPageDto, @TenantId() tenantId: string) {
        return this.cmsService.create(dto, tenantId);
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.cmsService.findAll(tenantId);
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string, @TenantId() tenantId: string) {
        return this.cmsService.findOne(slug, tenantId);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    update(
        @Param('id') id: string,
        @Body() dto: UpdateCmsPageDto,
        @TenantId() tenantId: string,
    ) {
        return this.cmsService.update(id, dto, tenantId);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string, @TenantId() tenantId: string) {
        return this.cmsService.remove(id, tenantId);
    }
}
