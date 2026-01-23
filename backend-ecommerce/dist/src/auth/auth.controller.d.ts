import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, tenantId: string): Promise<{
        access_token: string;
    }>;
    login(dto: LoginDto, tenantId: string): Promise<{
        access_token: string;
    }>;
}
