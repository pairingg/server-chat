import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { ClaimDto } from './dto/claim-dto';

@Controller('chatrooms')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService,
  ) {}

  /**
   * 채팅방 생성
   * @param createChatroomDto 
   * @returns 
   */
  @Post()
  create(@Headers('X-Authorization-memberId') userId: string, @Body() createChatroomDto: CreateChatroomDto) {
    return this.chatroomService.create(+userId, createChatroomDto);
  }

  /**
   * 채팅방 전체 조회
   * @returns 
   */
  @Get()
  findAll(@Headers('X-Authorization-memberId') userId: number) {
    return this.chatroomService.findAll(+userId);
  }

  @Post(':chatroomId/claim')
  claim(
    @Param('chatroomId') chatroomId: string,
    @Body() claimDto: ClaimDto
  ) {
    return this.chatroomService.claim(+chatroomId, claimDto);
  }

  @Post(':chatroomId/read')
  async markAsRead(
    @Param('chatroomId') chatroomId: string,
    @Headers('X-Authorization-memberId') userId: string
  ) {
    return this.chatroomService.markAsRead(+chatroomId, +userId);
  }2
}
