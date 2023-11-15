import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
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
        const data = await this.usersRepository.findOneEntity(id);
        if (!data) {
            throw new NotFoundException(Constants.NOT_FOUND);
        }
        return ResponseUtils.successResponseHandler(200, 'Data fetched successfully', 'data', data);
    }
}
