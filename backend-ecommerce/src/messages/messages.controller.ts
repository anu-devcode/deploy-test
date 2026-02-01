import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch, NotFoundException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Get()
    async findAll(@Request() req: any) {
        return this.messagesService.findAllForCustomer(req.user.id, req.tenantId);
    }

    @Get('unread-count')
    async getUnreadCount(@Request() req: any) {
        return { count: await this.messagesService.getUnreadCount(req.user.id, req.tenantId) };
    }

    @Get('admin')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.STAFF)
    async findAllAdmin(@Request() req: any) {
        return this.messagesService.findAllForAdmin(req.tenantId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req: any) {
        return this.messagesService.findOne(id, req.tenantId);
    }

    @Post()
    async create(@Request() req: any, @Body() body: { subject?: string; content: string; parentId?: string }) {
        return this.messagesService.create({
            tenantId: req.tenantId,
            customerId: req.user.id,
            subject: body.subject,
            content: body.content,
            senderRole: 'CUSTOMER',
            parentId: body.parentId,
        });
    }

    @Post('admin/:id/reply')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.STAFF)
    async adminReply(@Param('id') id: string, @Request() req: any, @Body() body: { content: string }) {
        const parent = await this.messagesService.findOne(id, req.tenantId);
        if (!parent) throw new NotFoundException('Parent message not found');

        return this.messagesService.create({
            tenantId: req.tenantId,
            customerId: (parent as any).customerId,
            content: body.content,
            senderRole: 'ADMIN',
            parentId: id,
        });
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.STAFF)
    async updateStatus(@Param('id') id: string, @Request() req: any, @Body() body: { status: any }) {
        return this.messagesService.updateStatus(id, body.status, req.tenantId);
    }
}
