import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChattingService } from './chatting.service';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { FindAllChattingDto } from './dto/findAll-chatting.dto';
import { ChatroomService } from '../chatroom/chatroom.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
  namespace: '/chat',
  transports: ['websocket'],
  path: '/socket.io'  // 기본 Socket.IO 경로
})
export class ChattingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private readonly logger = new Logger(ChattingGateway.name);

  constructor(
    private readonly chattingService: ChattingService,
    private readonly chatroomService: ChatroomService
  ) {}

  // 게이트웨이 초기화 후 호출
  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  // 클라이언트 연결 시 호출
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // 클라이언트 연결 해제 시 호출
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendChatting')
  async create(@MessageBody() createChattingDto: CreateChattingDto, @ConnectedSocket() client: Socket) {
    this.logger.log(`Message received from ${client.id}: ${JSON.stringify(createChattingDto)}`);
    const chatting = await this.chattingService.sendChatting(createChattingDto);
    this.server.emit('receiveChatting', chatting);
    return chatting;
  }

  @SubscribeMessage('findAllChatting')
  async findAll(@MessageBody() findAllChattingDto: FindAllChattingDto, @ConnectedSocket() client: Socket) {
    this.logger.log(`Finding all messages for chatroom: ${findAllChattingDto.chatroomId}`);
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
    @MessageBody() data: { userId: number; chatroomId: number },
    @ConnectedSocket() client: Socket
  ) {
    this.logger.log(`Marking messages as read for user ${data.userId} in chatroom ${data.chatroomId}`);
    await this.chatroomService.markAsRead(data.chatroomId, data.userId);
    this.server.emit('updateReadStatus', {
      userId: data.userId,
      chatroomId: data.chatroomId
    });
  }
}
