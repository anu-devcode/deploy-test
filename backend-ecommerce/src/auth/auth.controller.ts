import { Controller, Post, Body, Res, Req, UnauthorizedException, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RequestResetDto, ResetPasswordDto } from './dto';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const result = await this.authService.register(dto, userAgent, ipAddress);
        this.setCookies(res, result.access_token, result.refresh_token);
        return { user: result.user };
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const result = await this.authService.login(dto, userAgent, ipAddress);
        this.setCookies(res, result.access_token, result.refresh_token);
        return { user: result.user };
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        if (!refreshToken) throw new UnauthorizedException('No refresh token provided');

        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const result = await this.authService.refresh(refreshToken, userAgent, ipAddress);
        this.setCookies(res, result.access_token, result.refresh_token);
        return { user: result.user };
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { message: 'Logged out successfully' };
    }

    @Post('sessions')
    async listSessions(@Req() req: Request) {
        const user = (req as any).user;
        if (!user) throw new UnauthorizedException();
        return this.authService.listSessions(user.id);
    }

    @Post('sessions/revoke/:id')
    async revokeSession(@Param('id') sessionId: string, @Req() req: Request) {
        const user = (req as any).user;
        const currentToken = req.cookies['refresh_token'];
        if (!user || !currentToken) throw new UnauthorizedException();
        await this.authService.revokeSession(user.id, sessionId, currentToken);
        return { message: 'Session revoked' };
    }

    @Post('logout-all')
    async logoutAll(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user = (req as any).user;
        if (!user) throw new UnauthorizedException();
        await this.authService.logoutAllDevices(user.id);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { message: 'Logged out from all devices' };
    }

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

    @Get('config')
    async getConfig() {
        return this.authService.getStoreConfig();
    }

    @Post('config')
    async updateConfig(@Body('isSocialLoginEnabled') isSocialLoginEnabled: boolean) {
        return this.authService.updateStoreConfig(isSocialLoginEnabled);
    }

    @Get('2fa/settings')
    async getTwoFactorSettings(@Req() req: Request) {
        const user = (req as any).user;
        if (!user) throw new UnauthorizedException();
        return this.authService.getTwoFactorSettings(user.id);
    }

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

    private setCookies(res: Response, accessToken: string, refreshToken: string) {
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000 // 15 mins
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
}
