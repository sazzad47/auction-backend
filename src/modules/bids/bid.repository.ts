import { Model, Types } from 'mongoose';
import { Bid } from './schema/bid.schema';

export class BidRepository<BidDocument extends Bid> {
    constructor(private readonly model: Model<BidDocument>) {}

    async createBid(bidderId: string, itemId: string, amount: number): Promise<Bid> {
        const createdBid = new this.model({
            _id: new Types.ObjectId(),
            bidder: bidderId,
            item: itemId,
            amount,
        });

        return await createdBid.save();
    }

    async findUserBid(bidId: string, userId: string): Promise<Bid | null> {
        return await this.model.findOne({ _id: bidId, bidder: userId }).exec();
    }
}
