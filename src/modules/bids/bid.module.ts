import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BidSchema } from './schema/bid.schema';
import JwtHelper from 'src/core/jwt/jwt.helper';
import { JwtModule } from '@nestjs/jwt';
import JwtConfigService from 'src/core/jwt/jwt-config.service';
import { UsersSchema } from '../users/schema/users.schema';
import { ItemSchema } from '../items/schema/item.schema';
import { UsersService } from '../users/users.service';
import { ItemService } from '../items/item.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            useClass: JwtConfigService,
        }),
        MongooseModule.forFeature([
            { name: 'Bid', schema: BidSchema },
            { name: 'Item', schema: ItemSchema },
            { name: 'Users', schema: UsersSchema },
        ]),
    ],
    controllers: [BidController],
    providers: [BidService, ItemService, UsersService, JwtHelper],
})
export class BidModule {}
