import { Body, Controller, Post, Req} from '@nestjs/common';
import { Constants } from '../../utils/constants';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller({
    path: 'auth',
    version: Constants.API_VERSION_1
})
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @Post('/register')
    async register(@Body() dto: RegisterAuthDto) {
        return await this.authService.register(dto);
    }

    @Post('/login')
    async login(@Body() dto: LoginAuthDto) {
        return await this.authService.login(dto);
    }

    @Post('/validate-token')
    async verifyToken(@Req() req: any) {
        return await this.authService.validateRequest(req);
    }
}
