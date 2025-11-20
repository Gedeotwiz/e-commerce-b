import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true, default: '' })
  name: string;

  @Prop({ required: true, default: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parentCategory: Types.ObjectId | Category | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
