import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, minlength: 3, maxlength: 200 })
  title!: string;

  @Prop({ required: true, minlength: 10 })
  body!: string;

  @Prop({ required: true })
  authorUserId!: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ authorUserId: 1 });
PostSchema.index({ createdAt: -1 });
