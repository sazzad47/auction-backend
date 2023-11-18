import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export default class JwtHelper {
    constructor(private readonly jwtService: JwtService) {}

    generateAccessToken(payload: any, expiresIn: string) {
        const token = this.jwtService.sign(payload, { expiresIn: expiresIn });
        return token;
    }

    generateRefreshToken(payload: any, expiresIn: string) {
        const token = this.jwtService.sign(payload, { expiresIn: expiresIn, secret: process.env.REFRESH_TOKEN_SECRET });
        return token;
    }

    verifyAccessToken(token: string) {
        return this.jwtService.verify(token);
    }

    verifyRefreshToken(token: string) {
        return this.jwtService.verify(token, { secret: process.env.REFRESH_TOKEN_SECRET });
    }
}
