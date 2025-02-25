import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as AutoIncrement from 'mongoose-sequence';

export type ChattingDocument = HydratedDocument<Chatting>;

@Schema()
export class Chatting {
  @Prop()
  chattingId: number;

  @Prop()
  chatroomId: number;

  @Prop()
  senderId: number;

  @Prop()
  receiverId: number;

  @Prop()
  message: string;

  @Prop({ default: [] })
  readUsers: number[];  // 읽은 사용자 ID 목록

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ChattingSchema = SchemaFactory.createForClass(Chatting);

// Auto-increment 설정
ChattingSchema.plugin(AutoIncrement(mongoose), {
  inc_field: 'chattingId',
  start_seq: 1
});
