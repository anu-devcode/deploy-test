import { Controller, Post, Body, Res, Req, UnauthorizedException, Param, Get, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RequestResetDto, ResetPasswordDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        console.log('Register DTO received:', dto);
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const result = await this.authService.register(dto, userAgent, ipAddress);
        this.setCookies(res, result.access_token, result.refresh_token, 'STOREFRONT');
        return { user: result.user };
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const result = await this.authService.login(dto, userAgent, ipAddress);
        this.setCookies(res, result.access_token, result.refresh_token, dto.portal as any || 'STOREFRONT');
        return { user: result.user };
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        // Check both potential cookies
        const refreshToken = req.cookies['refresh_token'] || req.cookies['admin_refresh_token'];
        if (!refreshToken) throw new UnauthorizedException('No refresh token provided');

        const portal = req.cookies['admin_refresh_token'] ? 'ADMIN' : 'STOREFRONT';

        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const result = await this.authService.refresh(refreshToken, userAgent, ipAddress);
        this.setCookies(res, result.access_token, result.refresh_token, portal);
        return { user: result.user };
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body('portal') portal?: 'STOREFRONT' | 'ADMIN') {
        const refreshToken = req.cookies['refresh_token'] || req.cookies['admin_refresh_token'];
        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }

        if (portal === 'ADMIN') {
            res.clearCookie('admin_access_token');
            res.clearCookie('admin_refresh_token');
        } else if (portal === 'STOREFRONT') {
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
        } else {
            // Default: clear both (or handle as before for safety if portal is unknown)
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            res.clearCookie('admin_access_token');
            res.clearCookie('admin_refresh_token');
        }
        return { message: 'Logged out successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('sessions')
    async listSessions(@Req() req: Request) {
        const user = (req as any).user;
        if (!user) throw new UnauthorizedException();
        return this.authService.listSessions(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('sessions/revoke/:id')
    async revokeSession(@Param('id') sessionId: string, @Req() req: Request) {
        const user = (req as any).user;
        const currentToken = req.cookies['refresh_token'];
        if (!user || !currentToken) throw new UnauthorizedException();
        await this.authService.revokeSession(user.id, sessionId, currentToken);
        return { message: 'Session revoked' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout-all')
    async logoutAll(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user = (req as any).user;
        if (!user) throw new UnauthorizedException();
        await this.authService.logoutAllDevices(user.id);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { message: 'Logged out from all devices' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('delete-account')
    async deleteAccount(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user = (req as any).user;
        const currentToken = req.cookies['refresh_token'];
        if (!user || !currentToken) throw new UnauthorizedException();
        await this.authService.deleteAccount(user.id, currentToken);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { message: 'Account deleted' };
    }

    @Post('request-reset')
    requestReset(@Body() dto: RequestResetDto) {
        return this.authService.requestPasswordReset(dto.email);
    }

    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }

    @Get('verify-email')
    verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @Post('resend-verification')
    resendVerification(@Body('email') email: string) {
        return this.authService.resendVerificationEmail(email);
    }

    @Get('config')
    async getConfig() {
        return this.authService.getStoreConfig();
    }

    @Post('config')
    async updateConfig(@Body('isSocialLoginEnabled') isSocialLoginEnabled: boolean) {
        return this.authService.updateStoreConfig(isSocialLoginEnabled);
    }

    @UseGuards(JwtAuthGuard)
    @Get('2fa/settings')
    async getTwoFactorSettings(@Req() req: Request) {
        const user = (req as any).user;
        if (!user) throw new UnauthorizedException();
        return this.authService.getTwoFactorSettings(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('2fa/settings')
    async updateTwoFactorSettings(
        @Body('enabled') enabled: boolean,
        @Body('method') method: string,
        @Req() req: Request
    ) {
        const user = (req as any).user;
        if (!user) throw new UnauthorizedException();
        return this.authService.updateTwoFactorSettings(user.id, enabled, method);
    }

    private setCookies(res: Response, accessToken: string, refreshToken: string, portal: 'STOREFRONT' | 'ADMIN' = 'STOREFRONT') {
        const isProd = process.env.NODE_ENV === 'production';
        const prefix = portal === 'ADMIN' ? 'admin_' : '';

        res.cookie(`${prefix}access_token`, accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000 // 15 mins
        });

        res.cookie(`${prefix}refresh_token`, refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
}
