import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const uri = configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/pairing';
      if (!uri) {
        throw new Error('MONGODB_URI is not defined');
      }
      try {
        const connection = await mongoose.connect(uri);
        return connection;
      } catch (error) {
        console.error('Database connection error:', error);
        throw error;
      }
    },
  },
];
