import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Constants } from 'src/utils/constants';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller({ path: 'item', version: Constants.API_VERSION_1 })
export class ItemController {
    constructor(private readonly service: ItemService) {}

    @Post()
    @UseGuards(AuthGuard)
    create(@Body() dto: CreateItemDto) {
        return this.service.create(dto);
    }

    @Get()
    @UseGuards(AuthGuard)
    findAll() {
        return this.service.findAll();
    }
}
