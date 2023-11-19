import { Body, Controller, Get, Post, UseGuards, Req, Query } from '@nestjs/common';
import { Constants } from 'src/utils/constants';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';

@Controller({ path: 'bid', version: Constants.API_VERSION_1 })
export class BidController {
    constructor(private readonly service: BidService) {}

    @Post('/create')
    @UseGuards(AuthGuard)
    createBid(@Body() dto: CreateBidDto, @Req() req: any) {
        return this.service.createBid(dto, req.user._id);
    }
}
