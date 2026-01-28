import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Menu, MenuDocument } from './schemas/menu.schema';
import { CreateMenuDto } from './dto/create-menu.dto';

@Injectable()
export class MenuService {
    constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) { }

    async create(createMenuDto: CreateMenuDto): Promise<Menu> {
        const createdMenu = new this.menuModel(createMenuDto);
        return createdMenu.save();
    }

    async findAll(): Promise<Menu[]> {
        return this.menuModel.find().exec();
    }

    async findByCategory(category: string): Promise<Menu[]> {
        return this.menuModel.find({ category }).exec();
    }

    async findById(id: string): Promise<MenuDocument | null> {
        return this.menuModel.findById(id).exec();
    }
}
