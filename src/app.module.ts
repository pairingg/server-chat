import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChattingModule } from './chatting/chatting.module';
import { ChatroomModule } from './chatroom/chatroom.module';

@Module({
  imports: [ChattingModule, ChatroomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
