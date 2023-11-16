import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/core/abstract-entity';

@Schema({ timestamps: true, id: true, versionKey: false })
export class Item extends AbstractDocument {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    startPrice: string;

    @Prop({ required: true })
    startTime: string;

    @Prop({ required: true })
    timeWindow: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
