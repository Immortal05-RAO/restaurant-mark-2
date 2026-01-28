import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MenuDocument = Menu & Document;

@Schema()
export class Menu {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    category: string; // e.g., 'Starter', 'Main', 'Dessert', 'Drink'

    @Prop()
    imageUrl: string;

    @Prop({ default: true })
    available: boolean;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
