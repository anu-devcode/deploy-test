import { Controller, Get, Post, Patch, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    async findAll(@Request() req: any) {
        return this.notificationsService.findAll(req.user.id);
    }

    @Get('unread-count')
    async getUnreadCount(@Request() req: any) {
        return { count: await this.notificationsService.getUnreadCount(req.user.id) };
    }

    @Get('recent')
    async findRecent(@Request() req: any) {
        return this.notificationsService.findRecent(req.user.id);
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: string, @Request() req: any) {
        return this.notificationsService.markAsRead(id, req.user.id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req: any) {
        return this.notificationsService.delete(id, req.user.id);
    }
}
