import { BadRequestException, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, ClientSession } from 'mongoose';
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

    async reduceDepositAmount(session: ClientSession, userId: string, amount: number): Promise<void> {
        await this.DepositRepository.reduceDepositAmount(session, userId, amount);
    }

    async refundDeposit(userId: any, amount: number, session: ClientSession): Promise<void> {
        const updatedDeposit = await this.DepositRepository.refundDeposit(userId, amount, session);

        if (!updatedDeposit) {
            throw new HttpException('Deposit not found.', HttpStatus.NOT_FOUND);
        }
    }
}
