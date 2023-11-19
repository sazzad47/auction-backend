import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import JwtConfigService from './core/jwt/jwt-config.service';
import { UsersSchema } from './modules/users/schema/users.schema';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ItemModule } from './modules/items/item.module';
import { DepositModule } from './modules/deposits/deposit.module';
import { BidModule } from './modules/bids/bid.module';

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
        ScheduleModule.forRoot(),
        AuthModule,
        UsersModule,
        ItemModule,
        DepositModule,
        BidModule
    
    ],
    controllers: [AppController],
    providers: [
        AppService,
    ]
})
export class AppModule { }