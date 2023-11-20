import mongoose, { Model, Types, ClientSession } from 'mongoose';
import { Users } from './schema/users.schema';
import { CreateUsersDto } from './dto/create-users.dto';
import CryptoUtils from 'src/utils/crypto.utils';

export class UsersRepository<UsersDocument extends Users> {
    constructor(private readonly model: Model<UsersDocument>) {}

    async createEntity(data: CreateUsersDto): Promise<Users> {
        try {
            const createdEntity = new this.model({
                ...data,
                password: await CryptoUtils.encrypt(data?.password),
                _id: new Types.ObjectId(),
            });
            return await createdEntity.save();
        } catch (error) {
            throw new Error(`Error creating entity: ${error.message}`);
        }
    }

    async findOneByFilterQuery(query: any): Promise<Users | null> {
        try {
            return await this.model.findOne({ ...query })
                .populate([
                    { path: 'deposit' },
                    { path: 'bids' },
                ])
                .lean();
        } catch (error) {
            throw new Error(`Error finding entity by filter query: ${error.message}`);
        }
    }

    async updateWithDeposit(userId: string, depositId: string, session: ClientSession): Promise<void> {
        await this.model.updateOne({ _id: userId }, { $set: { deposit: depositId } }, { session });
    }

    async updateWithBid(userId: string, bidId: string): Promise<void> {
        await this.model.updateOne({ _id: userId }, { $push: { bids: bidId } });
    }

    async findLastBidTimestamp(userId: string): Promise<Date | null> {
        const user = await this.model
            .findById(userId)
            .populate({
                path: 'bids',
                options: { sort: { createdAt: -1 }, limit: 1 },
            })
            .lean()
            .exec();

        if (!user || !user.bids || user.bids.length === 0) {
            return null;
        }

        return user.bids[0].createdAt;
    }
}
