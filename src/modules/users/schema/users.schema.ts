import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/core/abstract-entity';
import { Item } from 'src/modules/items/schema/item.schema';
import { Deposit } from 'src/modules/deposits/schema/deposit.schema';
import { Bid } from 'src/modules/bids/schema/bid.schema';

@Schema({ timestamps: true, id: true, versionKey: false })
export class Users extends AbstractDocument {
    @Prop({ required: true, index: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: Types.ObjectId, ref: 'Deposit', nullable: true })
    deposit: Deposit;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Item' }], nullable: true })
    items: Item[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Bid' }], nullable: true })
    bids: Bid[];
}

export const UsersSchema = SchemaFactory.createForClass(Users);
