import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { MenuService } from '../menu/menu.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private menuService: MenuService,
    ) { }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const { tableId, items } = createOrderDto;
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const menuItem = await this.menuService.findById(item.menuItemId);
            if (!menuItem) {
                throw new BadRequestException(`Menu item ${item.menuItemId} not found`);
            }
            if (!menuItem.available) {
                throw new BadRequestException(`Menu item ${menuItem.name} is currently unavailable`);
            }

            const itemTotal = menuItem.price * item.quantity;
            totalAmount += itemTotal;
            orderItems.push({
                menuItemId: menuItem._id.toString(), // Store simplified ID
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity,
            });
        }

        const order = new this.orderModel({
            tableId,
            items: orderItems,
            totalAmount,
            status: 'PENDING',
        });
        return order.save();
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel.find().sort({ createdAt: -1 }).exec();
    }

    async findByTable(tableId: string): Promise<Order[]> {
        return this.orderModel.find({ tableId }).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderModel.findById(id).exec();
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async updateStatus(id: string, status: string): Promise<Order> {
        const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }
}
