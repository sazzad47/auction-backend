import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from './schema/item.schema';
import JwtHelper from 'src/core/jwt/jwt.helper';
import { JwtModule } from '@nestjs/jwt';
import JwtConfigService from 'src/core/jwt/jwt-config.service';
import { UsersSchema } from '../users/schema/users.schema';
import { DepositService } from '../deposits/deposit.service';
import { DepositSchema } from '../deposits/schema/deposit.schema';

@Module({
    imports: [
        JwtModule.registerAsync({
            useClass: JwtConfigService,
        }),
        MongooseModule.forFeature([
            { name: 'Item', schema: ItemSchema },
            { name: 'Users', schema: UsersSchema },
            { name: 'Deposit', schema: DepositSchema },
        ]),
    ],
    controllers: [ItemController],
    providers: [ItemService, DepositService, JwtHelper],
})
export class ItemModule {}
