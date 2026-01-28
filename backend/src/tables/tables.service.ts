import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table, TableDocument } from './schemas/table.schema';
import { CreateTableDto } from './dto/create-table.dto';

@Injectable()
export class TablesService {
    constructor(@InjectModel(Table.name) private tableModel: Model<TableDocument>) { }

    async create(createTableDto: CreateTableDto): Promise<Table> {
        const { tableId } = createTableDto;
        // In a real app, we might check collision or auto-generate UUIDs.
        // For now, we assume admin provides a unique human-readable ID (e.g. "T1", "T2").
        // The QR code could be just the URL to the table.
        const qrCode = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/table/${tableId}`;

        const createdTable = new this.tableModel({
            tableId,
            qrCode,
        });
        return createdTable.save();
    }

    async findOne(tableId: string): Promise<Table> {
        const table = await this.tableModel.findOne({ tableId }).exec();
        if (!table) {
            throw new NotFoundException(`Table #${tableId} not found`);
        }
        return table;
    }

    async findAll(): Promise<Table[]> {
        return this.tableModel.find().exec();
    }
}

