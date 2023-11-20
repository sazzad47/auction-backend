import mongoose, { Model, Types, ClientSession } from 'mongoose';
import { Item } from './schema/item.schema';
import { CreateItemDto } from './dto/create-item.dto';

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

        return await this.model.findOne({ _id: id, sold: false }).populate('bids').exec();
    }

    async updateWithBid(itemId: string, bidId: string): Promise<void> {
        await this.model.updateOne({ _id: itemId }, { $push: { bids: bidId } });
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

    async findHighestBidAmount(itemId: string): Promise<number | null> {
        const item = await this.model
            .findById(itemId)
            .populate({
                path: 'bids',
                options: { sort: { amount: -1 }, limit: 1 },
            })
            .exec();

        if (item && item.bids && item.bids.length > 0) {
            return item.bids[0].amount;
        }

        return null;
    }

    async findUnsoldItemsWithBids(): Promise<Item[]> {
        const currentTime = new Date();

        return this.model
            .find({
                sold: false,
                endTime: { $gt: currentTime },
            })
            .populate('bids')
            .sort({ endTime: 1 })
            .exec();
    }

    async markItemAsSold(item: any, session: ClientSession): Promise<void> {
        item.sold = true;
        await item.save({ session });
    }
}
