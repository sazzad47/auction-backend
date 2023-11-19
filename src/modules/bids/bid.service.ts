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

@Injectable()
export class BidService {
    constructor(
        @InjectModel('Bid') private readonly BidModel: Model<Bid>,
        private readonly usersService: UsersService,
        private readonly itemService: ItemService,
    ) {}

    private readonly BidRepository = new BidRepository(this.BidModel);

    async createBid(dto: CreateBidDto, userId: string): Promise<Bid> {
        const { itemId, amount } = dto;

        const [bidder, item, highestBidAmount] = await Promise.all([
            this.usersService.findOne(userId),
            this.itemService.findOne(itemId),
            this.itemService.findHighestBidAmount(itemId),
        ]);

        if (!bidder || !item) {
            throw new NotFoundException(Constants.NOT_FOUND);
        }  

        this.validateBidAmount(amount, item.startPrice, highestBidAmount);

        const newBid = await this.BidRepository.createBid(userId, itemId, amount);
        await this.itemService.updateWithBid(itemId, newBid._id);

        console.log('item', item)
        console.log('highestBidAmount', highestBidAmount)

        return ResponseUtils.successResponseHandler(201, 'Bid created successfully!', 'data', newBid);
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
