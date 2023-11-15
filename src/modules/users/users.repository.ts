import mongoose, { Model, Types } from 'mongoose';
import { Users } from './schema/users.schema';
import { CreateUsersDto } from './dto/create-users.dto';
import CryptoUtils from 'src/utils/crypto.utils';

export class UsersRepository<UsersDocument extends Users> {
    constructor(private readonly model: Model<UsersDocument>) { }

    async createEntity(data: CreateUsersDto): Promise<Users> {
        const createdEntity = new this.model({
            ...data,
            password: await CryptoUtils.encrypt(data?.password),
            _id: new Types.ObjectId()
        });
        return await createdEntity.save();
    }


    async findOneEntity(id: string): Promise<Users | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return await this.model.findOne({ _id: id });
    }

    async findOneByFilterQuery(query: any): Promise<Users | null> {

        return await this.model.findOne({ ...query }).lean();
    }
}