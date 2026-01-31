import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private jwtService: JwtService) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.headers.authorization?.split(' ')[1];
            if (token) {
                const payload = this.jwtService.verify(token);
                // Join tenant room
                if (payload.tenantId) {
                    client.join(`tenant:${payload.tenantId}`);
                }
                // Join user room
                if (payload.sub) {
                    client.join(`user:${payload.sub}`);
                }
            }
        } catch (error) {
            // Connection allowed without auth for public updates, but rooms restricted
        }
    }

    handleDisconnect(client: Socket) { }

    @SubscribeMessage('subscribe_order')
    handleSubscribeOrder(@MessageBody() data: { orderId: string }, @ConnectedSocket() client: Socket) {
        client.join(`order:${data.orderId}`);
        return { event: 'subscribed', data: `Joined order room: ${data.orderId}` };
    }

    // Method to emit events from other services
    notifyOrderStatusUpdate(tenantId: string, orderId: string, status: string) {
        this.server.to(`tenant:${tenantId}`).emit('order_updated', { orderId, status });
        this.server.to(`order:${orderId}`).emit('order_status_changed', { orderId, status });
    }

    notifyNewOrder(tenantId: string, order: any) {
        this.server.to(`tenant:${tenantId}`).emit('new_order', order);
    }

    notifyProductUpdate(tenantId: string, product: any) {
        this.server.to(`tenant:${tenantId}`).emit('product_updated', product);
    }

    notifyInventoryUpdate(tenantId: string, productId: string, stock: number) {
        this.server.to(`tenant:${tenantId}`).emit('inventory_updated', { productId, stock });
    }

    notifySystemAnnouncement(tenantId: string, announcement: any) {
        this.server.to(`tenant:${tenantId}`).emit('system_announcement', announcement);
    }
}
