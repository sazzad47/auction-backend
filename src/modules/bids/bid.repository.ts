import mongoose, { Model, Types } from 'mongoose';
import { Bid } from './schema/bid.schema';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

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

    async refundUserBid(bidId: string): Promise<void> {
        await this.model.findByIdAndRemove(bidId).exec();
    }
}
