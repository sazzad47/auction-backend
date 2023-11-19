import { Body, Controller, Get, Post, UseGuards, Req, Query } from '@nestjs/common';
import { Constants } from 'src/utils/constants';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Controller({ path: 'deposit', version: Constants.API_VERSION_1 })
export class DepositController {
    constructor(private readonly service: DepositService) {}

    @Post('/create')
    @UseGuards(AuthGuard)
    depositAmount(@Body() dto: CreateDepositDto, @Req() req: any) {
        return this.service.depositAmount(dto, req.user._id);
    }
}
