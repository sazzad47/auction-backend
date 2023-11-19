import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/core/abstract-entity';
import { Users } from 'src/modules/users/schema/users.schema';

@Schema({ timestamps: true, id: true, versionKey: false })
export class Deposit extends AbstractDocument {
    @Prop({ required: true })
    amount: number;

    @Prop({ type: Types.ObjectId, ref: 'Users', unique: true })
    user: Users;
}

export const DepositSchema = SchemaFactory.createForClass(Deposit);
