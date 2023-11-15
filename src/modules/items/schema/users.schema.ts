import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/core/abstract-entity';

@Schema({ timestamps: true, id: true, versionKey: false })
export class Users extends AbstractDocument {
  @Prop({
    default: null,
    nullable: true,
  })
  firstName: string;

  @Prop({
    default: null,
    nullable: true,
  })
  lastName: string;

  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    default: null,
    nullable: true,
  })
  phone: string;

  @Prop({
    default: null,
    nullable: true,
  })
  image: string;

  @Prop({
    default: 'customer',
    enum: ['customer', 'admin']
  })
  userType: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);