import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RequestResetDto, ResetPasswordDto } from './dto';
import { TenantId } from '../common/decorators';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto, @TenantId() tenantId: string) {
        return this.authService.register(dto, tenantId);
    }

    @Post('login')
    login(@Body() dto: LoginDto, @TenantId() tenantId: string) {
        return this.authService.login(dto, tenantId);
    }

    @Post('request-reset')
    requestReset(@Body() dto: RequestResetDto, @TenantId() tenantId: string) {
        return this.authService.requestPasswordReset(dto.email, tenantId);
    }

    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }
}
