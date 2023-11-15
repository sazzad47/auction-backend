import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/core/abstract-entity';

@Schema({ timestamps: true, id: true, versionKey: false })
export class Users extends AbstractDocument {
  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);