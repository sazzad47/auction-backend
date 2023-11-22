import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schema/item.schema';
import { ItemRepository } from './item.repository';
import { CreateItemDto } from './dto/create-item.dto';
import { Constants } from 'src/utils/constants';
import { ResponseUtils } from 'src/utils/response.utils';
import { Cron } from '@nestjs/schedule';
import { DepositService } from '../deposits/deposit.service';

@Injectable()
export class ItemService {
    constructor(
        @InjectModel('Item') private readonly ItemModel: Model<Item>,
        private readonly depositService: DepositService,
    ) {}

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
        // Fetch unsold items before starting the session
        const unsoldItems = await this.ItemRepository.findUnsoldItemsWithBids();
        // Check if there are unsold items
        if (unsoldItems.length === 0) {
            // No unsold items, no need to start the session or proceed further
            return;
        }

        const session = await this.ItemModel.startSession();

        try {
            session.startTransaction();

            for (const item of unsoldItems) {
                if (item.bids && item.bids.length > 0) {
                    // Sort bids in descending order by amount
                    const sortedBids = item.bids.sort((a, b) => b.amount - a.amount);

                    // Refund bid amounts to unsuccessful bidders
                    for (const bid of sortedBids.slice(1)) {
                        await this.depositService.refundDeposit(bid.bidder._id, bid.amount, session);
                    }

                }
                // Mark the item as sold
                await this.ItemRepository.markItemAsSold(item, session);
            }

            // Commit the transaction
            await session.commitTransaction();
        } catch (error) {
            // Abort the transaction on error
            await session.abortTransaction();
            throw error;
        } finally {
            // End the session
            session.endSession();
        }
    }

    async findHighestBidAmount(itemId: string): Promise<number | null> {
        try {
            const highestBidAmount = await this.ItemRepository.findHighestBidAmount(itemId);
            return highestBidAmount;
        } catch (err) {
            throw new NotFoundException(Constants.NOT_FOUND);
        }
    }

    async findOne(id: string): Promise<Item | null> {
        const data = await this.ItemRepository.findOneEntity(id);
        if (!data) {
            throw new NotFoundException(Constants.NOT_FOUND);
        }
        return data;
    }

    async updateWithBid(itemId: string, bidId: any): Promise<void> {
        return await this.ItemRepository.updateWithBid(itemId, bidId);
    }
}
