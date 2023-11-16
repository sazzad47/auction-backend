import mongoose, { Model, Types } from 'mongoose';
import { Item } from './schema/item.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

export class ItemRepository<ItemDocument extends Item> {
    constructor(private readonly model: Model<ItemDocument>) {}

    async createEntity(data: CreateItemDto): Promise<Item> {
        const createdEntity = new this.model({
            ...data,
            _id: new Types.ObjectId(),
        });
        return await createdEntity.save();
    }

    async findOneEntity(id: string): Promise<Item | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        // return await this.model.findById(id);
        return await this.model.findOne({ _id: id, isDeleted: false });
    }

    async updateEntity(id: string, data: UpdateItemDto): Promise<Item | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async findAll(): Promise<Item[]> {
        return await this.model.find({ isDeleted: false });
    }
}
