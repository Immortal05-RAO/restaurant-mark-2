import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateMenuDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    price: number;

    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsBoolean()
    available?: boolean;
}
