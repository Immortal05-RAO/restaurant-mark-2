import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MenuService } from './menu/menu.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const menuService = app.get(MenuService);

    const items = [
        { name: 'Truffle Fries', description: 'Hand-cut fries with truffle oil and parmesan', price: 8.5, category: 'Starter', available: true },
        { name: 'Wagyu Burger', description: 'Premium waygu beef with cheddar and bacon jam', price: 18.0, category: 'Main', available: true },
        { name: 'Caesar Salad', description: 'Crisp romaine with homemade garlic croutons', price: 12.0, category: 'Starter', available: true },
        { name: 'Pasta Carbonara', description: 'Authentic roman style with guanciale', price: 16.5, category: 'Main', available: true },
        { name: 'Tiramisu', description: 'Classic italian dessert', price: 9.0, category: 'Dessert', available: true },
        { name: 'Coke', description: 'Chilled can', price: 3.0, category: 'Drinks', available: true },
    ];

    for (const item of items) {
        await menuService.create(item);
        console.log(`Seeded: ${item.name}`);
    }

    await app.close();
}
bootstrap();
