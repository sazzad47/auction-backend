import {JwtModuleOptions, JwtOptionsFactory} from "@nestjs/jwt";

// @Injectable()
export default class JwtConfigService implements JwtOptionsFactory {

    createJwtOptions(): JwtModuleOptions {
        return {
            secret: 'mobisecntrixtest' // process.env.SECRET_JWT
        };
    }
}