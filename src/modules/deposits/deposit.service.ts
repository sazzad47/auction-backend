import { BadRequestException, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, ClientSession } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Deposit } from './schema/deposit.schema';
import { DepositRepository } from './deposit.repository';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { ResponseUtils } from 'src/utils/response.utils';
import { UsersService } from '../users/users.service';

@Injectable()
export class DepositService {
    constructor(
        @InjectModel('Deposit') private readonly DepositModel: Model<Deposit>,
        private readonly usersService: UsersService,
    ) {}

    private readonly DepositRepository = new DepositRepository(this.DepositModel);

    async depositAmount(dto: CreateDepositDto, userId: string): Promise<Deposit> {
        const { amount } = dto;

        const session = await this.DepositModel.startSession();
        session.startTransaction();

        try {
            const existingDeposit = await this.DepositRepository.findOneByUserId(userId);
            let deposit: Deposit;

            if (existingDeposit) {
                deposit = await this.DepositRepository.updateDeposit(amount, userId, session);
            } else {
                deposit = await this.DepositRepository.createDeposit(amount, userId, session);
                await this.usersService.updateWithDeposit(userId, deposit._id, session);
            }

            await session.commitTransaction();
            return ResponseUtils.successResponseHandler(201, 'Amount deposited successfully', 'data', deposit);
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
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
