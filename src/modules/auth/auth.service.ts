import {
    Injectable,
    InternalServerErrorException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ResponseUtils } from 'src/utils/response.utils';
import JwtHelper from '../../core/jwt/jwt.helper';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from '../users/schema/users.schema';
import { UsersRepository } from '../users/users.repository';
import CryptoUtils from 'src/utils/crypto.utils';
import { CreateUsersDto } from '../users/dto/create-users.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtHelper: JwtHelper,
        @InjectModel('Users') private readonly usersModel: Model<Users>,
    ) {}

    private readonly usersRepository = new UsersRepository(this.usersModel);

    async login(dto: LoginAuthDto): Promise<any> {
        const { email, password } = dto;
        const data = await this.usersRepository.findOneByFilterQuery({ email: email });

        if (!data) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        const resData = await this.authenticateUser(password, data);
        if (resData == null) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        return resData;
    }

    async authenticateUser(password: string, user: Users): Promise<any> {
        const { password: passwordHash, ...entityWithoutPassword } = user;

        const matched = await CryptoUtils.compare(password, passwordHash);
        if (matched) {
            const token = this.jwtHelper.generateToken(
                {
                    userId: entityWithoutPassword._id,
                },
                '7d',
            );
            return {
                token: token,
                user: entityWithoutPassword,
            };
        }
        return null;
    }

    async register(dto: RegisterAuthDto): Promise<Users | Error> {
        const { email, password } = dto;

        const isEmailExists = await this.usersRepository.findByEmailAddress(email);
        if (isEmailExists) {
            throw new HttpException('Email Already Exists', HttpStatus.BAD_REQUEST);
        }
        const createUserDto = {
            email,
            password,
        } as CreateUsersDto;

        const data = await this.usersRepository.createEntity(createUserDto);

        if (data instanceof Error) {
            return new InternalServerErrorException(data);
        } else {
            const loginData = await this.login({
                email: email,
                password: password,
            });

            return ResponseUtils.successResponseHandler(201, 'User registered successfully!', 'data', loginData);
        }
    }

    async validateRequest(req: any): Promise<boolean> {
        try {
            const bearerToken = req.headers.authorization;
            const bearer = 'Bearer ';
            if (!bearerToken || !bearerToken.startsWith(bearer)) {
                return false;
            }
            const token = bearerToken.replace(bearer, '');
            const jwtPayload = this.jwtHelper.verifyToken(token);
            const data = await this.usersRepository.findOneEntity(jwtPayload.userId);
            if (!data || data instanceof Error) {
                return false;
            }

            req.data = data;

            return true;
        } catch (e) {
            return false;
        }
    }
}
