import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from 'src/__share__/enum/enum';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  names: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: 'english' })
  languge: string;

  @Prop({ default: null })
  birthDay: string;

  @Prop({
    default: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  })
  image: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.GUEST,
  })
  role: UserRole;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  verfied: boolean;

  @Prop({ type: String, default: null })
  otp: string | null ;

  @Prop({ type: Date, default: null })
  otpExpires: Date | null ;
}

export const UserSchema = SchemaFactory.createForClass(User);
