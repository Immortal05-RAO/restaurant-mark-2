import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
    @Prop({ required: true })
    orderId: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop()
    comment: string;

    @Prop({ default: false })
    discountCodeGenerated: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
