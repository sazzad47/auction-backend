import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/core/abstract-entity';
import { Users } from 'src/modules/users/schema/users.schema';
import { Item } from 'src/modules/items/schema/item.schema';

@Schema({ timestamps: true, id: true, versionKey: false })
export class Bid extends AbstractDocument {
    @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
    bidder: Users;

    @Prop({ type: Types.ObjectId, ref: 'Item', required: true })
    item: Item;

    @Prop({ required: true })
    amount: number;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
