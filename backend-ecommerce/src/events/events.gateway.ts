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

import { Public } from '../common/decorators/public.decorator';

@Public()
@WebSocketGateway({
    cors: {
        origin: '*', // Cors is handled by main.ts, this is for socket.io specific
        credentials: true,
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
    // Method to emit events from other services
    notifyOrderStatusUpdate(orderId: string, status: string) {
        this.server.emit('order_updated', { orderId, status });
        this.server.to(`order:${orderId}`).emit('order_status_changed', { orderId, status });
    }

    notifyNewOrder(order: any) {
        this.server.emit('new_order', order);
    }

    notifyProductUpdate(product: any) {
        this.server.emit('product_updated', product);
    }

    notifyInventoryUpdate(productId: string, stock: number) {
        this.server.emit('inventory_updated', { productId, stock });
    }

    notifySystemAnnouncement(announcement: any) {
        this.server.emit('system_announcement', announcement);
    }
}
