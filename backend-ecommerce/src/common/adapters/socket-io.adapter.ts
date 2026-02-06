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
        const server = super.createIOServer(port, {
            ...options,
            cors: {
                origin: 'https://frontend-ecommerce-red.vercel.app',
                credentials: true,
                methods: ['GET', 'POST'],
            },
        });

        return server;
    }
}
