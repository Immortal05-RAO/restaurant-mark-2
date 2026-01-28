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

    async seed() {
        const count = await this.menuModel.countDocuments();
        if (count > 0) return { message: 'Database already seeded' };

        const items = [
            { name: 'Truffle Fries', description: 'Hand-cut fries with truffle oil and parmesan', price: 8.5, category: 'Starter', available: true },
            { name: 'Wagyu Burger', description: 'Premium waygu beef with cheddar and bacon jam', price: 18.0, category: 'Main', available: true },
            { name: 'Caesar Salad', description: 'Crisp romaine with homemade garlic croutons', price: 12.0, category: 'Starter', available: true },
            { name: 'Pasta Carbonara', description: 'Authentic roman style with guanciale', price: 16.5, category: 'Main', available: true },
            { name: 'Tiramisu', description: 'Classic italian dessert', price: 9.0, category: 'Dessert', available: true },
            { name: 'Coke', description: 'Chilled can', price: 3.0, category: 'Drinks', available: true },
        ];

        await this.menuModel.insertMany(items);
        return { message: 'Database seeded successfully', count: items.length };
    }
}
