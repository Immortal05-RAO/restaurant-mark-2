import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem {
    @Prop({ required: true })
    menuItemId: string; // Reference to Menu ID

    @Prop({ required: true })
    name: string; // Snapshot of name

    @Prop({ required: true })
    price: number; // Snapshot of price

    @Prop({ required: true, default: 1 })
    quantity: number;
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true })
    tableId: string;

    @Prop({ type: [SchemaFactory.createForClass(OrderItem)], default: [] })
    items: OrderItem[];

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ required: true, enum: ['PENDING', 'PREPARING', 'SERVED', 'COMPLETED', 'CANCELLED'], default: 'PENDING' })
    status: string;

    @Prop()
    customerEmail: string; // Optional, collected at end
}

export const OrderSchema = SchemaFactory.createForClass(Order);
