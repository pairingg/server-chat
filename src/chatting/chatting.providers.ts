
import { Connection } from 'mongoose';
import { ChattingSchema } from './schemas/chatting.schema';

export const chattingProviders = [
  {
    provide: 'CHATTING_MODEL',
    useFactory: (connection: Connection) => connection.model('Chatting', ChattingSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
