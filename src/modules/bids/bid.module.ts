import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BidSchema } from './schema/bid.schema';
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
            { name: 'Item', schema: BidSchema },
            { name: 'Users', schema: UsersSchema },
        ]),
    ],
    controllers: [BidController],
    providers: [BidService, JwtHelper],
})
export class ItemModule {}
