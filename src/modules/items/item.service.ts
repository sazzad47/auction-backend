import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schema/item.schema';
import { ItemRepository } from './item.repository';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Constants } from 'src/utils/constants';
import { ResponseUtils } from 'src/utils/response.utils';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ItemService {
    constructor(@InjectModel('Item') private readonly ItemModel: Model<Item>) {}

    private readonly ItemRepository = new ItemRepository(this.ItemModel);

    async create(dto: CreateItemDto, userId: string): Promise<Item> {
        try {
            const data = await this.ItemRepository.createEntity(dto, userId);
            if (!data) {
                throw new BadRequestException(Constants.CREATE_FAILED);
            }
            return ResponseUtils.successResponseHandler(201, 'Successfully created data', 'data', data);
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async findAll(query: any): Promise<Item[]> {
        const { sold, page, limit } = query;
        const data = await this.ItemRepository.findAll(sold, page, limit);
        if (!data) {
            throw new NotFoundException(Constants.NOT_FOUND);
        }
        return ResponseUtils.successResponseHandler(200, 'Data fetched successfully', 'data', data);
    }

    @Cron('* * * * * *')
    async checkAndUpdateSoldStatus(): Promise<void> {
        return await this.ItemRepository.checkAndUpdateSoldStatus();
    }

    async findOne(id: string): Promise<Item | null> {
        const data = await this.ItemRepository.findOneEntity(id);
        if (!data) {
            throw new NotFoundException(Constants.NOT_FOUND);
        }
        return ResponseUtils.successResponseHandler(200, 'Data fetched successfully', 'data', data);
    }

    async update(id: string, dto: UpdateItemDto): Promise<Item | null> {
        const res = await this.ItemRepository.findOneEntity(id);
        if (!res) {
            throw new NotFoundException(Constants.NOT_FOUND);
        }
        const data = await this.ItemRepository.updateEntity(id, dto);
        if (!data) {
            throw new BadRequestException(Constants.UPDATE_FAILED);
        }
        return ResponseUtils.successResponseHandler(200, 'Data updated successfully', 'data', data);
    }
}
