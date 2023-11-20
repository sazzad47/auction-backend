import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, ClientSession } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schema/users.schema';
import { UsersRepository } from './users.repository';
import { CreateUsersDto } from './dto/create-users.dto';
import { Constants } from 'src/utils/constants';
import { ResponseUtils } from 'src/utils/response.utils';

@Injectable()
export class UsersService {
    constructor(@InjectModel('Users') private readonly usersModel: Model<Users>) {}

    private readonly usersRepository = new UsersRepository(this.usersModel);

    async create(dto: CreateUsersDto): Promise<Users> {
        try {
            const data = await this.usersRepository.createEntity(dto);
            if (!data) {
                throw new BadRequestException(Constants.CREATE_FAILED);
            }
            return ResponseUtils.successResponseHandler(201, 'Successfully created data', 'data', data);
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async findOne(id: string): Promise<Users | null> {
        const data = await this.usersRepository.findOneByFilterQuery({_id: id});
        if (!data) {
            throw new NotFoundException(Constants.NOT_FOUND);
        }
        return data;
    }

    async updateWithDeposit(userId: string, depositId: any, session: ClientSession): Promise<void> {
        return await this.usersRepository.updateWithDeposit(userId, depositId, session);
    }

    async updateWithBid(userId: string, bidId: any): Promise<void> {
        return await this.usersRepository.updateWithBid(userId, bidId);
    }

    async findLastBidTimestamp(userId: string): Promise<Date | null> {
        try {
            const lastBidTimestamp = await this.usersRepository.findLastBidTimestamp(userId);
            if (lastBidTimestamp === null) {
                throw new NotFoundException('User or bid not found.');
            }
            return lastBidTimestamp;
        } catch (error) {
            throw new NotFoundException('User or bid not found.');
        }
    }
}
