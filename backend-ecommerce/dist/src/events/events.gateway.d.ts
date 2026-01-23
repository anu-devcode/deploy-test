import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    server: Server;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleSubscribeOrder(data: {
        orderId: string;
    }, client: Socket): {
        event: string;
        data: string;
    };
    notifyOrderStatusUpdate(tenantId: string, orderId: string, status: string): void;
    notifyNewOrder(tenantId: string, order: any): void;
}
