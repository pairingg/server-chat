import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChattingService } from './chatting.service';
import { ChattingGateway } from './chatting.gateway';
import { Chatting, ChattingSchema } from './schemas/chatting.schema';
import { Chatroom, ChatroomSchema } from '../chatroom/schemas/chatroom.schemas';
import { DatabaseModule } from '../database/database.module';
import { chattingProviders } from './chatting.providers';
import { ReadReceipt, ReadReceiptSchema } from './schemas/read-receipt.schema';
import { ChatroomModule } from '../chatroom/chatroom.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatting.name, schema: ChattingSchema },
      { name: Chatroom.name, schema: ChatroomSchema },
      { name: ReadReceipt.name, schema: ReadReceiptSchema }
    ]),
    DatabaseModule,
    ChatroomModule
  ],
  providers: [
    ChattingGateway, 
    ChattingService,
    ...chattingProviders
  ],
})
export class ChattingModule {}
