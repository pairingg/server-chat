import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as AutoIncrement from 'mongoose-sequence';

export type ChatroomDocument = HydratedDocument<Chatroom>;

@Schema()
export class Chatroom {
  @Prop()
  chatroomId: number;

  @Prop()
  member1Id: number;

  @Prop()
  member2Id: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Map, of: Date, default: {} })
  lastReadAt: Map<string, Date>;  // 각 사용자의 마지막 읽은 시간
}

export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);

ChatroomSchema.plugin(AutoIncrement(mongoose), {
  inc_field: 'chatroomId',
  start_seq: 1
});
