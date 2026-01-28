import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
    constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) { }

    async create(createReviewDto: CreateReviewDto): Promise<Review> {
        const { orderId, email } = createReviewDto;

        // Check if review already exists for this order
        const existing = await this.reviewModel.findOne({ orderId }).exec();
        if (existing) {
            throw new BadRequestException('Review already submitted for this order');
        }

        const review = new this.reviewModel({
            ...createReviewDto,
            discountCodeGenerated: true, // In a real app, we'd generate a unique code.
        });
        return review.save();
    }

    async findAll(): Promise<Review[]> {
        return this.reviewModel.find().sort({ createdAt: -1 }).exec();
    }
}

