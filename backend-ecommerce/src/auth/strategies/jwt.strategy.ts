import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: (req) => {
                let token = null;
                if (req && req.cookies) {
                    token = req.cookies['access_token'] || req.cookies['admin_access_token'];
                }
                return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
            },
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'supersecretkey',
        });
    }

    async validate(payload: JwtPayload) {
        return {
            id: payload.sub,
            userId: payload.sub,
            sub: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
}
