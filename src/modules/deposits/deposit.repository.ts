import { Model, Types } from 'mongoose';
import { Deposit } from './schema/deposit.schema';

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
}
