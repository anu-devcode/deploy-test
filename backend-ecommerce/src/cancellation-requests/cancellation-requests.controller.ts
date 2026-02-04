import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CancellationRequestsService } from './cancellation-requests.service';
import { CreateCancellationRequestDto, ReviewCancellationRequestDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, CancellationRequestStatus } from '@prisma/client';

@Controller('cancellation-requests')
export class CancellationRequestsController {
    constructor(private readonly service: CancellationRequestsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Request() req, @Body() dto: CreateCancellationRequestDto) {
        // Get customer ID from the authenticated user
        const customer = await req.prisma?.customer.findUnique({
            where: { email: req.user.email },
        });

        return this.service.createRequest(customer?.id, dto.orderId, dto.reason);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.STAFF)
    async findAll(@Query('status') status?: CancellationRequestStatus) {
        return this.service.findAll(status);
    }

    @Get('my-requests')
    @UseGuards(AuthGuard('jwt'))
    async findMyRequests(@Request() req) {
        const customer = await req.prisma?.customer.findUnique({
            where: { email: req.user.email },
        });

        if (!customer) {
            return [];
        }

        return this.service.findByCustomer(customer.id);
    }

    @Patch(':id/review')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.STAFF)
    async review(
        @Request() req,
        @Param('id') id: string,
        @Body() dto: ReviewCancellationRequestDto
    ) {
        return this.service.reviewRequest(id, req.user.id, dto.decision, dto.feedback);
    }
}
