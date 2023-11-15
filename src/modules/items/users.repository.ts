import mongoose, { Model, Types } from 'mongoose';
import { Users } from './schema/users.schema';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
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

        // return await this.model.findById(id);
        return await this.model.findOne({ _id: id, isDeleted: false });
    }

    async findOneByFilterQuery(query: any): Promise<Users | null> {

        // return await this.model.findById(id);
        return await this.model.findOne({ ...query, isDeleted: false }).lean();
    }

    async updateEntity(id: string, data: UpdateUsersDto): Promise<Users | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteEntity(id: string): Promise<boolean> {
        // const data = await this.model.findByIdAndDelete(id);
        const data = await this.model.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
        if (data) return true;
        return false;
    }

    async findAll(): Promise<Users[]> {
        return await this.model.find({ isDeleted: false });
    }
}