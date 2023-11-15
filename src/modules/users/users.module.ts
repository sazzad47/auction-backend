import {Module} from "@nestjs/common";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersSchema } from "./schema/users.schema";
import JwtHelper from "src/core/jwt/jwt.helper";
import { JwtModule } from "@nestjs/jwt";
import JwtConfigService from "src/core/jwt/jwt-config.service";

@Module({
    imports: [
        JwtModule.registerAsync({
            useClass: JwtConfigService
        }),
        MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    ],
    controllers: [UsersController],
    providers: [UsersService, JwtHelper]
})
export class UsersModule {
}
