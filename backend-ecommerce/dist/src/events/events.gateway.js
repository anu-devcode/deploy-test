"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let EventsGateway = class EventsGateway {
    jwtService;
    server;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.headers.authorization?.split(' ')[1];
            if (token) {
                const payload = this.jwtService.verify(token);
                if (payload.tenantId) {
                    client.join(`tenant:${payload.tenantId}`);
                }
                if (payload.sub) {
                    client.join(`user:${payload.sub}`);
                }
            }
        }
        catch (error) {
        }
    }
    handleDisconnect(client) { }
    handleSubscribeOrder(data, client) {
        client.join(`order:${data.orderId}`);
        return { event: 'subscribed', data: `Joined order room: ${data.orderId}` };
    }
    notifyOrderStatusUpdate(tenantId, orderId, status) {
        this.server.to(`tenant:${tenantId}`).emit('order_updated', { orderId, status });
        this.server.to(`order:${orderId}`).emit('order_status_changed', { orderId, status });
    }
    notifyNewOrder(tenantId, order) {
        this.server.to(`tenant:${tenantId}`).emit('new_order', order);
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe_order'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleSubscribeOrder", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map