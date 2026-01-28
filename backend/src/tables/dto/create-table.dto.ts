import { IsString } from 'class-validator';

export class CreateTableDto {
    @IsString()
    tableId: string;
}
