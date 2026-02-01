import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CmsService } from './cms.service';
import { CreateCmsPageDto, UpdateCmsPageDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cms')
export class CmsController {
    constructor(private readonly cmsService: CmsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Body() dto: CreateCmsPageDto) {
        return this.cmsService.create(dto);
    }

    @Get()
    findAll() {
        return this.cmsService.findAll();
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.cmsService.findOne(slug);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    update(
        @Param('id') id: string,
        @Body() dto: UpdateCmsPageDto,
    ) {
        return this.cmsService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string) {
        return this.cmsService.remove(id);
    }
}
