import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import JwtConfigService from 'src/core/jwt/jwt-config.service';
import JwtHelper from 'src/core/jwt/jwt.helper';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from '../users/schema/users.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
        JwtModule.registerAsync({
            useClass: JwtConfigService,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtHelper],
})
export class AuthModule {
}
