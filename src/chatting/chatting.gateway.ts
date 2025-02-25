import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChattingService } from './chatting.service';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { FindAllChattingDto } from './dto/findAll-chatting.dto';
import { ChatroomService } from '../chatroom/chatroom.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
  port: 3000
})
export class ChattingGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chattingService: ChattingService,
    private readonly chatroomService: ChatroomService
  ) {}

  @SubscribeMessage('sendChatting')
  async create(@MessageBody() createChattingDto: CreateChattingDto) {
    console.log(createChattingDto);
    const chatting = await this.chattingService.sendChatting(createChattingDto);
    console.log(chatting);
    this.server.emit('receiveChatting', chatting);
    return chatting;
  }

  @SubscribeMessage('findAllChatting')
  async findAll(@MessageBody() findAllChattingDto: FindAllChattingDto) {
    const chatting = await this.chattingService.findAll(findAllChattingDto.chatroomId);
    this.server.emit(`receiveChatting`, chatting);
    return chatting;
  }

  @SubscribeMessage('findOneChatting')
  findOne(@MessageBody() id: number) {
    return this.chattingService.findOne(id);
  }

  @SubscribeMessage('findAllChattingrooms')
  update(@MessageBody() updateChattingDto: UpdateChattingDto) {
    return this.chattingService.update(updateChattingDto.id, updateChattingDto);
  }

  @SubscribeMessage('removeChatting')
  remove(@MessageBody() id: number) {
    return this.chattingService.remove(id);
  }

  @SubscribeMessage('readMessages')
  async handleReadMessages(
    @MessageBody() data: { userId: number; chatroomId: number }
  ) {
    await this.chatroomService.markAsRead(data.chatroomId, data.userId);
    this.server.emit('updateReadStatus', {
      userId: data.userId,
      chatroomId: data.chatroomId
    });
  }
}
