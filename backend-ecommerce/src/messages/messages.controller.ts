import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch, NotFoundException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req: any) {
        return this.messagesService.findAllForCustomer(req.user.id);
    }

    @Get('unread-count')
    @UseGuards(JwtAuthGuard)
    async getUnreadCount(@Request() req: any) {
        return { count: await this.messagesService.getUnreadCount(req.user.id) };
    }

    @Get('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.STAFF)
    async findAllAdmin(@Request() req: any) {
        return this.messagesService.findAllForAdmin();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Request() req: any) {
        return this.messagesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Request() req: any, @Body() body: { subject?: string; content: string; parentId?: string }) {
        return this.messagesService.create({
            customerId: req.user.id,
            subject: body.subject,
            content: body.content,
            senderRole: 'CUSTOMER',
            parentId: body.parentId,
        });
    }

    @Post('guest')
    async createGuest(@Body() body: { name: string; email: string; subject?: string; content: string }) {
        return this.messagesService.create({
            guestName: body.name,
            guestEmail: body.email,
            subject: body.subject,
            content: body.content,
            senderRole: 'CUSTOMER',
        });
    }

    @Post('admin/:id/reply')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.STAFF)
    async adminReply(@Param('id') id: string, @Request() req: any, @Body() body: { content: string }) {
        const parent = await this.messagesService.findOne(id);
        if (!parent) throw new NotFoundException('Parent message not found');

        return this.messagesService.create({
            customerId: (parent as any).customerId,
            guestEmail: (parent as any).guestEmail,
            guestName: (parent as any).guestName,
            content: body.content,
            senderRole: 'ADMIN',
            parentId: id,
        });
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.STAFF)
    async updateStatus(@Param('id') id: string, @Request() req: any, @Body() body: { status: any }) {
        return this.messagesService.updateStatus(id, body.status);
    }
}
