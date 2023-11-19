import { Module } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DepositSchema } from './schema/deposit.schema';
import JwtHelper from 'src/core/jwt/jwt.helper';
import { JwtModule } from '@nestjs/jwt';
import JwtConfigService from 'src/core/jwt/jwt-config.service';
import { UsersSchema } from '../users/schema/users.schema';

@Module({
    imports: [
        JwtModule.registerAsync({
            useClass: JwtConfigService,
        }),
        MongooseModule.forFeature([
            { name: 'Deposit', schema: DepositSchema },
            { name: 'Users', schema: UsersSchema },
        ]),
    ],
    controllers: [DepositController],
    providers: [DepositService, JwtHelper],
})
export class DepositModule {}
