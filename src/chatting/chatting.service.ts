import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { Chatting, ChattingDocument } from './schemas/chatting.schema';
import { Chatroom, ChatroomDocument } from '../chatroom/schemas/chatroom.schemas';
import { ReadReceipt, ReadReceiptDocument } from './schemas/read-receipt.schema';

@Injectable()
export class ChattingService {
  constructor(
    @InjectModel(Chatting.name) private chattingModel: Model<ChattingDocument>,
    @InjectModel(Chatroom.name) private chatroomModel: Model<ChatroomDocument>,
    @InjectModel(ReadReceipt.name) private readReceiptModel: Model<ReadReceiptDocument>
  ) {}

  async sendChatting(createChattingDto: CreateChattingDto): Promise<Chatting> {
    const createdChatting = new this.chattingModel({
      ...createChattingDto,
      readUsers: [createChattingDto.senderId], // 보낸 사람은 자동으로 읽음 처리
      createdAt: new Date()
    });
    
    // 상대방의 안 읽은 메시지 수 증가
    await this.chatroomModel.updateOne(
      { chatroomId: createChattingDto.chatroomId },
      { $inc: { [`unreadCount.${createChattingDto.receiverId}`]: 1 } }
    );
  
    return createdChatting.save();
  }

  /**
   * 채팅 내역 전체 조회
   * @param chatroomId 
   * @returns 
   */
  async findAll(chatroomId: number): Promise<Chatting[]> {
    return this.chattingModel
      .find({ chatroomId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: number): Promise<Chatting | null> {
    return this.chattingModel.findOne({ ChattingId: id }).exec();
  }

  update(id: number, updateChattingDto: UpdateChattingDto) {
    return `This action updates a #${id} chatting`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatting`;
  }

  async getReadReceipts(chattingId: number): Promise<ReadReceipt[]> {
    return this.readReceiptModel
      .find({ chattingId })
      .sort({ readAt: 1 })
      .exec();
  }
}
