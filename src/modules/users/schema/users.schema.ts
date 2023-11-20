import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/core/abstract-entity';
import { Bid } from 'src/modules/bids/schema/bid.schema';

@Schema({ timestamps: true, id: true, versionKey: false })
export class Users extends AbstractDocument {
    @Prop({ required: true, index: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [{ type: Types.ObjectId }], nullable: true, ref: 'Bid' })
    bids: Bid[];
}

export const UsersSchema = SchemaFactory.createForClass(Users);
