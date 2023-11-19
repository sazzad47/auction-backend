import mongoose, { Model, Types } from 'mongoose';
import { Item } from './schema/item.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

export class ItemRepository<ItemDocument extends Item> {
    constructor(private readonly model: Model<ItemDocument>) {}

    async createEntity(data: CreateItemDto, userId: string): Promise<Item> {
        const createdEntity = new this.model({
            ...data,
            _id: new Types.ObjectId(),
            createdBy: userId,
        });
        return await createdEntity.save();
    }

    async findOneEntity(id: string): Promise<Item | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return await this.model.findOne({ _id: id, isDeleted: false });
    }

    async updateEntity(id: string, data: UpdateItemDto): Promise<Item | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async findAll(
        sold?: boolean,
        page: number = 1,
        limit: number = 10,
    ): Promise<{ items: Item[]; totalCount: number }> {
        const query: Record<string, any> = {};

        if (sold !== undefined) {
            query.sold = sold;
        }

        query.startTime = { $lte: new Date() };

        const items = await this.model
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        const totalCount = await this.model.countDocuments(query);

        return { items, totalCount };
    }

    async checkAndUpdateSoldStatus() {
        const currentTime = new Date();
        const itemsToUpdate = await this.model.find({
            endTime: { $lte: currentTime },
            sold: false,
        });

        if (itemsToUpdate.length > 0) {
            await this.model.updateMany({ _id: { $in: itemsToUpdate.map((item) => item._id) } }, { sold: true });
        }
    }
}
