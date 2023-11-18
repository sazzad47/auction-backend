import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Constants } from '../../utils/constants';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller({
    path: 'auth',
    version: Constants.API_VERSION_1,
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    async register(@Body() dto: RegisterAuthDto, @Res({ passthrough: true }) res: Response) {
        return await this.authService.register(dto, res);
    }

    @Post('/login')
    async login(@Body() dto: LoginAuthDto, @Res({ passthrough: true }) res: Response) {
        return await this.authService.login(dto, res);
    }

    @Post('/access-token')
    async accessToken(@Req() req: any) {
        return await this.authService.accessToken(req);
    }

    @Post('/logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        return await this.authService.logout(res);
    }
}
