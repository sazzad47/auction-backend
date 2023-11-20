import { Model, Types, ClientSession } from 'mongoose';
import { Deposit } from './schema/deposit.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

export class DepositRepository<DepositDocument extends Deposit> {
    constructor(private readonly model: Model<DepositDocument>) {}

    async findOneByUserId(userId: string): Promise<Deposit | null> {
        return await this.model.findOne({ user: userId });
    }

    async createDeposit( amount: number, userId: string): Promise<Deposit> {
        const deposit = new this.model({
            _id: new Types.ObjectId(),
            amount,
            user: userId,
        });
        return await deposit.save();
    }

    async updateDeposit( amount: number, userId: string): Promise<Deposit | null> {
        return await this.model.findOneAndUpdate(
            { user: userId },
            { $inc: { amount } },
            { new: true },
        );
    }

    async reduceDepositAmount(session: ClientSession, userId: string, amount: number): Promise<void> {
        const deposit = await this.model.findOneAndUpdate(
            { user: userId, amount: { $gte: amount } },
            { $inc: { amount: -amount } },
            { new: true, session }
        );
    
        if (!deposit) {
            throw new HttpException('Insufficient funds in the deposit.', HttpStatus.BAD_REQUEST);
        }
    }

    async refundDeposit(userId: string, amount: number, session: ClientSession): Promise<Deposit | null> {
        return await this.model.findOneAndUpdate(
            { user: userId },
            { $inc: { amount: -amount } }, 
            { new: true, session },
        );
    }
}
