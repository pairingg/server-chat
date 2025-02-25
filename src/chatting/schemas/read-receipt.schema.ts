import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as AutoIncrement from 'mongoose-sequence';

export type ReadReceiptDocument = HydratedDocument<ReadReceipt>;

@Schema()
export class ReadReceipt {
  @Prop()
  readReceiptId: number;

  @Prop()
  chattingId: number;

  @Prop()
  userId: number;

  @Prop({ default: Date.now })
  readAt: Date;
}

export const ReadReceiptSchema = SchemaFactory.createForClass(ReadReceipt);

ReadReceiptSchema.plugin(AutoIncrement(mongoose), {
  inc_field: 'readReceiptId',
  start_seq: 1
}); 