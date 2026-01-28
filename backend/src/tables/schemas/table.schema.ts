import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TableDocument = Table & Document;

@Schema()
export class Table {
    @Prop({ required: true, unique: true })
    tableId: string;

    @Prop({ required: true, unique: true })
    qrCode: string; // The content of the QR code (e.g., URL or unique token)
}

export const TableSchema = SchemaFactory.createForClass(Table);
