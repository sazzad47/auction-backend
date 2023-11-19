import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Deposit } from './schema/deposit.schema';
import { DepositRepository } from './deposit.repository';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { ResponseUtils } from 'src/utils/response.utils';

@Injectable()
export class DepositService {
    constructor(@InjectModel('Deposit') private readonly DepositModel: Model<Deposit>) {}

    private readonly DepositRepository = new DepositRepository(this.DepositModel);

    async depositAmount(dto: CreateDepositDto, userId: string): Promise<Deposit> {
        try {
            const { amount } = dto;
            const existingDeposit = await this.DepositRepository.findOneByUserId(userId);

            let deposit: Deposit;

            if (existingDeposit) {
                deposit = await this.DepositRepository.updateDeposit(amount, userId);
            } else {
                deposit = await this.DepositRepository.createDeposit(amount, userId);
            }

            return ResponseUtils.successResponseHandler(201, 'Amount deposited successfully', 'data', deposit);
        } catch (err) {
            throw new BadRequestException(err);
        }
    }
}
