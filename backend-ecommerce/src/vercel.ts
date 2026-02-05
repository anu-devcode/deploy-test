import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

let cachedServer: any;

export default async function handler(req: any, res: any) {
    if (!cachedServer) {
        const app = await NestFactory.create(AppModule);

        // Enable CORS - Permissive Mode for requests
        app.enableCors({
            origin: true, // Reflects the request origin, effectively allowing all
            credentials: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            allowedHeaders: 'Content-Type, Accept, Authorization',
        });

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: false,
            }),
        );

        app.use(cookieParser());
        app.use(json({ limit: '50mb' }));
        app.use(urlencoded({ extended: true, limit: '50mb' }));

        // Match main.ts static file serving
        // Note: In serverless, writing to disk/serving uploads is distinct, but route parity helps validity
        // import { join } from 'path'; // Needed at top if using join
        // app.use('/uploads', require('express').static(require('path').join(__dirname, '..', 'uploads')));

        app.setGlobalPrefix('api');

        await app.init();
        cachedServer = app.getHttpAdapter().getInstance();
    }

    return cachedServer(req, res);
}
