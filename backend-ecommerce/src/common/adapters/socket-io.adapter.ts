import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
    constructor(
        private app: INestApplicationContext,
        private configService: ConfigService,
    ) {
        super(app);
    }

    createIOServer(port: number, options?: ServerOptions): any {
        const clientUrl = this.configService.get<string>('FRONTEND_URL') || 'https://frontend-ecommerce-red.vercel.app';
        const cors = {
            origin: true,
            methods: ['GET', 'POST'],
            credentials: true,
        };

        const optionsWithCors: ServerOptions = {
            ...options,
            cors,
        } as ServerOptions;

        // Create the server with merged options
        return super.createIOServer(port, optionsWithCors);
    }
}
