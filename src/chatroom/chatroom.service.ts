import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { Chatroom, ChatroomDocument } from './schemas/chatroom.schemas';
import { ClaimDto } from './dto/claim-dto';
import { Chatting, ChattingDocument } from '../chatting/schemas/chatting.schema';
import { ReadReceipt, ReadReceiptDocument } from '../chatting/schemas/read-receipt.schema';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel(Chatroom.name) private chatroomModel: Model<ChatroomDocument>,
    @InjectModel(Chatting.name) private chattingModel: Model<ChattingDocument>,
    @InjectModel(ReadReceipt.name) private readReceiptModel: Model<ReadReceiptDocument>
  ) {}

  async create(userId: number, createChatroomDto: CreateChatroomDto): Promise<Chatroom> {
    const createdChatroom = new this.chatroomModel({
      member1Id: userId,
      member2Id: createChatroomDto.memberId,
      createdAt: new Date()
    });
    return createdChatroom.save();
  }

  async findAll(memberId: number): Promise<Chatroom[]> {
    return this.chatroomModel
      .find({
        $or: [
          { member1Id: memberId },
          { member2Id: memberId }
        ]
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(chatroomId: number, userId: number): Promise<void> {
    const now = new Date();
    
    // 채팅방 찾기
    const chatroom = await this.chatroomModel.findOne({ chatroomId }).exec();
    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }

    // 채팅방의 lastReadAt 업데이트
    await this.chatroomModel.updateOne(
      { chatroomId },
      { $set: { [`lastReadAt.${userId}`]: now } }
    );

    // 안 읽은 메시지 찾기
    const unreadMessages = await this.chattingModel.find({
      chatroomId,
      readUsers: { $ne: userId }
    }).exec();

    // 읽음 처리 생성
    const readReceipts = unreadMessages.map(message => ({
      chattingId: message.chattingId,
      userId,
      readAt: now
    }));

    await this.readReceiptModel.insertMany(readReceipts);

    // 메시지에 읽은 사용자 추가
    await this.chattingModel.updateMany(
      { chatroomId, readUsers: { $ne: userId } },
      { $push: { readUsers: userId } }
    );
  }

  async getUnreadCount(chatroomId: number, userId: number): Promise<number> {
    return this.chattingModel.countDocuments({
      chatroomId,
      readUsers: { $ne: userId }
    });
  }

  async findOne(id: number): Promise<Chatroom | null> {
    return this.chatroomModel.findOne({ chatroomId: id }).exec();
  }

  async claim(chatroomId: number, claimDto: ClaimDto): Promise<object> {
    console.log('Searching for chatroomId:', chatroomId, typeof chatroomId);
    const chatroom = await this.chatroomModel.findOne({ chatroomId }).exec();
    console.log('Found chatroom:', chatroom);
    
    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }
    const result = await this.chatroomModel.deleteOne({ chatroomId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Failed to delete chatroom');
    }

    return { message: 'Chatroom deleted successfully' };
  }

  update(id: number, updateChatroomDto: UpdateChatroomDto) {
    return `This action updates a #${id} chatroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatroom`;
  }
}
