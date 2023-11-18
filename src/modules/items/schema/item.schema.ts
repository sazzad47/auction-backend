import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/core/abstract-entity';
import { Users } from 'src/modules/users/schema/users.schema';

@Schema({ timestamps: true, id: true, versionKey: false })
export class Item extends AbstractDocument {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    startPrice: string;

    @Prop({ required: true })
    startTime: string;

    @Prop({ required: true })
    endTime: string;

    @Prop({ default: false, nullable: true })
    sold?: boolean;

    @Prop({ type: Types.ObjectId, ref: 'Users' })
    createdBy: Users;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
