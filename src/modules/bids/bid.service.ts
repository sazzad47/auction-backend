import { Injectable, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Bid } from './schema/bid.schema';
import { UsersService } from 'src/modules/users/users.service';
import { ItemService } from 'src/modules/items/item.service';
import { Constants } from 'src/utils/constants';
import { ResponseUtils } from 'src/utils/response.utils';
import { BidRepository } from './bid.repository';
import { CreateBidDto } from './dto/create-bid.dto';
import { DepositService } from '../deposits/deposit.service';

@Injectable()
export class BidService {
    constructor(
        @InjectModel('Bid') private readonly BidModel: Model<Bid>,
        private readonly usersService: UsersService,
        private readonly itemService: ItemService,
        private readonly depositService: DepositService,
    ) {}

    private readonly BidRepository = new BidRepository(this.BidModel);

    async createBid(dto: CreateBidDto, userId: string): Promise<Bid> {
        const { itemId, amount } = dto;

        const lastBidTimestamp = await this.usersService.findLastBidTimestamp(userId);
        const currentTime = new Date();
        const timeDifferenceInSeconds = lastBidTimestamp
            ? Math.floor((currentTime.getTime() - lastBidTimestamp.getTime()) / 1000)
            : 5; 

        if (timeDifferenceInSeconds < 5) {
            throw new HttpException('You can only place one bid every 5 seconds', HttpStatus.BAD_REQUEST);
        }

        const [bidder, item, highestBidAmount] = await Promise.all([
            this.usersService.findOne(userId),
            this.itemService.findOne(itemId),
            this.itemService.findHighestBidAmount(itemId),
        ]);

        if (!bidder || !item) {
            throw new NotFoundException(Constants.NOT_FOUND);
        }

        this.validateBidAmount(amount, item.startPrice, highestBidAmount);

        // Start a Mongoose session for the transaction
        const session = await this.BidModel.startSession();

        try {
            session.startTransaction();

            const newBid = await this.BidRepository.createBid(userId, itemId, amount);

            // Update item with the new bid ID
            await this.itemService.updateWithBid(itemId, newBid._id);

            // Update user with the new bid ID
            await this.usersService.updateWithBid(userId, newBid._id);

            // Reduce deposit amount
            await this.depositService.reduceDepositAmount(session, userId, amount);

            await session.commitTransaction();

            return ResponseUtils.successResponseHandler(201, 'Bid created successfully!', 'data', newBid);
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    private validateBidAmount(amount: number, startPrice: number, highestBidAmount: number | null): void {
        if (!highestBidAmount && amount < startPrice) {
            throw new HttpException('Bid amount should be higher than start price', HttpStatus.BAD_REQUEST);
        }

        if (highestBidAmount && amount <= highestBidAmount) {
            throw new HttpException('Bid amount should be higher than current bid price', HttpStatus.BAD_REQUEST);
        }
    }

}
