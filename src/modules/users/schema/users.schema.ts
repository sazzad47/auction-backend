import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/core/abstract-entity';
import { Item } from 'src/modules/items/schema/item.schema';

@Schema({ timestamps: true, id: true, versionKey: false })
export class Users extends AbstractDocument {
    @Prop({ required: true, index: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Item' }], nullable: true })
    items: Item[];
}

export const UsersSchema = SchemaFactory.createForClass(Users);
