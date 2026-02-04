import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

let cachedServer: any;

export default async function handler(req: any, res: any) {
    if (!cachedServer) {
        const app = await NestFactory.create(AppModule);

        app.enableCors({
            origin: process.env.FRONTEND_URL || '*',
            credentials: true,
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

        app.setGlobalPrefix('api');

        await app.init();
        cachedServer = app.getHttpAdapter().getInstance();
    }

    return cachedServer(req, res);
}
