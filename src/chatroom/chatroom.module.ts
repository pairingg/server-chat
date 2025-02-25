import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { Chatroom, ChatroomSchema } from './schemas/chatroom.schemas';
import { Chatting, ChattingSchema } from '../chatting/schemas/chatting.schema';
import { ReadReceipt, ReadReceiptSchema } from '../chatting/schemas/read-receipt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatroom.name, schema: ChatroomSchema },
      { name: Chatting.name, schema: ChattingSchema },
      { name: ReadReceipt.name, schema: ReadReceiptSchema }
    ])
  ],
  controllers: [ChatroomController],
  providers: [ChatroomService],
  exports: [ChatroomService]
})
export class ChatroomModule {}
