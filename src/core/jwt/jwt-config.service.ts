import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

export default class JwtConfigService implements JwtOptionsFactory {
    createJwtOptions(): JwtModuleOptions {
        return {
            secret: process.env.SECRET_JWT,
        };
    }
}
