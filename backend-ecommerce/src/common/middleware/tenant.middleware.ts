import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Extend Request to include tenantId
declare global {
    namespace Express {
        interface Request {
            tenantId?: string;
        }
    }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Extract tenant from header, query, or JWT
        const tenantId = req.headers['x-tenant-id'] as string || req.query['tenantId'] as string;

        if (!tenantId) {
            throw new BadRequestException('Tenant ID is required');
        }

        req.tenantId = tenantId;
        next();
    }
}
