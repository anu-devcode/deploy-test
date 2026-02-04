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

    @Get('admin')
    async findAllForAdmin(@Request() req: any) {
        return this.notificationsService.findAllForAdmin(req.user.role, req.user.id);
    }

    @Get('unread-count')
    async getUnreadCount(@Request() req: any) {
        return { count: await this.notificationsService.getUnreadCount(req.user.id) };
    }

    @Get('admin/unread-count')
    async getUnreadCountForAdmin(@Request() req: any) {
        return { count: await this.notificationsService.getUnreadCountForAdmin(req.user.role, req.user.id) };
    }

    @Get('recent')
    async findRecent(@Request() req: any) {
        return this.notificationsService.findRecent(req.user.id);
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: string, @Request() req: any) {
        // If user is admin/staff, they might be reading a targeted notification
        if (req.user.role === 'ADMIN' || req.user.role === 'STAFF') {
            return this.notificationsService.markAsRead(id);
        }
        return this.notificationsService.markAsRead(id, req.user.id);
    }

    @Patch('mark-all-read')
    async markAllRead(@Request() req: any) {
        if (req.user.role === 'ADMIN' || req.user.role === 'STAFF') {
            return this.notificationsService.markAllAsReadForAdmin(req.user.role, req.user.id);
        }
        return this.notificationsService.markAllAsRead(req.user.id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req: any) {
        return this.notificationsService.delete(id, req.user.id);
    }
}
