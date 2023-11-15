import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import JwtConfigService from './core/jwt/jwt-config.service';
import { UsersSchema } from './modules/users/schema/users.schema';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        MongooseModule.forRoot(process.env.DATABASE_URL),
        MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
        JwtModule.registerAsync({
            useClass: JwtConfigService
        }),
        AuthModule,
        UsersModule,
    
    ],
    controllers: [AppController],
    providers: [
        AppService,
    ]
})
export class AppModule { }