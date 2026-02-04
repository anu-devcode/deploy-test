import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../email/email.service';
import { OrderStatus, CancellationRequestStatus } from '@prisma/client';

@Injectable()
export class CancellationRequestsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
        private emailService: EmailService,
    ) { }

    async createRequest(customerId: string | undefined, orderId: string, reason: string) {
        // Check if order exists
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { customer: true },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Verify ownership (customer must own this order)
        if (customerId && order.customerId !== customerId) {
            throw new ForbiddenException('You do not have permission to cancel this order');
        }

        // Check if order can be cancelled (only PENDING or PROCESSING)
        if (!this.canCancelOrder(order.status)) {
            throw new BadRequestException(`Orders in ${order.status} status cannot be cancelled. Only PENDING or PROCESSING orders can be requested for cancellation.`);
        }

        // Check if a pending request already exists
        const existingRequest = await this.prisma.cancellationRequest.findFirst({
            where: {
                orderId,
                status: 'PENDING',
            },
        });

        if (existingRequest) {
            throw new BadRequestException('A cancellation request for this order is already pending review');
        }

        // Create cancellation request
        const request = await this.prisma.cancellationRequest.create({
            data: {
                orderId,
                customerId,
                reason,
                requestedAt: new Date(),
            },
            include: {
                order: true,
                customer: true,
            },
        });

        // Notify admins about new cancellation request
        try {
            await this.notificationsService.create({
                title: 'New Cancellation Request',
                message: `Order ${order.orderNumber} - Customer requests cancellation`,
                type: 'ORDER_STATUS',
                targetRole: 'ADMIN',
            });
        } catch (error) {
            console.error('Failed to send notification:', error);
        }

        return request;
    }

    async findAll(status?: CancellationRequestStatus) {
        const where = status ? { status } : {};
        return this.prisma.cancellationRequest.findMany({
            where,
            include: {
                order: {
                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
                customer: true,
                reviewedByUser: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                requestedAt: 'desc',
            },
        });
    }

    async findByCustomer(customerId: string) {
        return this.prisma.cancellationRequest.findMany({
            where: { customerId },
            include: {
                order: true,
                reviewedByUser: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                requestedAt: 'desc',
            },
        });
    }

    async reviewRequest(requestId: string, staffId: string, decision: 'APPROVED' | 'REJECTED', feedback?: string) {
        const request = await this.prisma.cancellationRequest.findUnique({
            where: { id: requestId },
            include: {
                order: true,
                customer: true,
            },
        });

        if (!request) {
            throw new NotFoundException('Cancellation request not found');
        }

        if (request.status !== 'PENDING') {
            throw new BadRequestException('This request has already been reviewed');
        }

        // Require feedback if rejecting
        if (decision === 'REJECTED' && (!feedback || feedback.trim().length === 0)) {
            throw new BadRequestException('Feedback is required when rejecting a cancellation request');
        }

        // Update the request
        const updatedRequest = await this.prisma.cancellationRequest.update({
            where: { id: requestId },
            data: {
                status: decision,
                reviewedBy: staffId,
                staffFeedback: feedback,
                reviewedAt: new Date(),
            },
            include: {
                order: true,
                customer: true,
                reviewedByUser: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        // If approved, cancel the order
        if (decision === 'APPROVED') {
            await this.prisma.order.update({
                where: { id: request.orderId },
                data: {
                    status: 'CANCELLED',
                },
            });
        }

        // Send notification and email to customer
        const customerEmail = request.customer?.email || request.order.guestEmail;
        const customerName = request.customer
            ? `${request.customer.firstName || ''} ${request.customer.lastName || ''}`.trim()
            : request.order.guestName;

        if (decision === 'APPROVED') {
            // Send approval notification
            if (request.customerId) {
                await this.notificationsService.create({
                    title: 'Cancellation Approved',
                    message: `Your cancellation request for order ${request.order.orderNumber} has been approved. The order has been cancelled.`,
                    type: 'ORDER_STATUS',
                    customerId: request.customerId,
                });
            }

            // Send approval email
            if (customerEmail) {
                try {
                    await this.emailService.sendEmail({
                        to: customerEmail,
                        subject: `Order Cancellation Approved - ${request.order.orderNumber}`,
                        template: 'order-cancelled',
                        context: {
                            customerName: customerName || 'Customer',
                            orderNumber: request.order.orderNumber,
                            reason: request.reason,
                            feedback: feedback || 'Your cancellation request has been approved.',
                        },
                    });
                } catch (error) {
                    console.error('Failed to send approval email:', error);
                }
            }
        } else {
            // Send rejection notification
            if (request.customerId) {
                await this.notificationsService.create({
                    title: 'Cancellation Request Declined',
                    message: `Your cancellation request for order ${request.order.orderNumber} has been declined. ${feedback || ''}`,
                    type: 'ORDER_STATUS',
                    customerId: request.customerId,
                });
            }

            // Send rejection email
            if (customerEmail) {
                try {
                    await this.emailService.sendEmail({
                        to: customerEmail,
                        subject: `Order Cancellation Request Declined - ${request.order.orderNumber}`,
                        template: 'cancellation-rejected',
                        context: {
                            customerName: customerName || 'Customer',
                            orderNumber: request.order.orderNumber,
                            reason: request.reason,
                            feedback: feedback || 'Your cancellation request could not be approved at this time.',
                        },
                    });
                } catch (error) {
                    console.error('Failed to send rejection email:', error);
                }
            }
        }

        return updatedRequest;
    }

    private canCancelOrder(status: OrderStatus): boolean {
        // Only allow cancellation for PENDING and PROCESSING orders
        return status === 'PENDING' || status === 'PROCESSING' || status === 'PENDING_VERIFICATION' || status === 'CONFIRMED';
    }
}
