import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            tenantId?: string;
        }
    }
}
export declare class TenantMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
