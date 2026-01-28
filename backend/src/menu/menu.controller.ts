import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) { }

    @Post()
    create(@Body() createMenuDto: CreateMenuDto) {
        return this.menuService.create(createMenuDto);
    }

    @Get()
    findAll(@Query('category') category?: string) {
        if (category) {
            return this.menuService.findByCategory(category);
        }
        return this.menuService.findAll();
    }

    @Get('seed-db')
    seed() {
        return this.menuService.seed();
    }
}

