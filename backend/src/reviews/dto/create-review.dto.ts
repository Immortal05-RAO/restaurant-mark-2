import { IsString, IsEmail, IsNumber, Min, Max, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @IsEmail()
    email: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsString()
    comment?: string;
}
