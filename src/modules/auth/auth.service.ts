import { Injectable, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
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

    async login(dto: LoginAuthDto, res: Response): Promise<any> {
        const { email, password } = dto;
        const data = await this.usersRepository.findOneByFilterQuery({ email: email });

        if (!data) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        const resData = await this.authenticateUser(password, data, res);
        if (resData == null) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        return resData;
    }

    async authenticateUser(password: string, user: Users, res: Response): Promise<any> {
        const { password: passwordHash, ...entityWithoutPassword } = user;

        const matched = await CryptoUtils.compare(password, passwordHash);
        if (matched) {
            const accessToken = this.jwtHelper.generateAccessToken(
                {
                    userId: entityWithoutPassword._id,
                },
                '1d',
            );
            const refreshToken = this.jwtHelper.generateAccessToken(
                {
                    userId: entityWithoutPassword._id,
                },
                '30d',
            );

            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                path: '/api/v1/auth/access-token',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
                sameSite: 'none',
            });

            return {
                token: accessToken,
                user: entityWithoutPassword,
            };
        }
        return null;
    }

    async register(dto: RegisterAuthDto, res: Response): Promise<Users | Error> {
        const { email, password } = dto;

        const isEmailExists = await this.usersRepository.findOneByFilterQuery({ email: email });
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
            const loginData = await this.login(
                {
                    email: email,
                    password: password,
                },
                res,
            );

            return ResponseUtils.successResponseHandler(201, 'User registered successfully!', 'data', loginData);
        }
    }

    async accessToken(req: any): Promise<any> {
        try {
            const token = req.cookies.refreshtoken;
            if (!token) {
                throw new HttpException('Please login', HttpStatus.BAD_REQUEST);
            }

            const jwtPayload = await this.jwtHelper.verifyAccessToken(token);
            const user = await this.usersRepository.findOneByFilterQuery({ _id: jwtPayload.userId });
            if (!user || user instanceof Error) {
                throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
            }

            const accessToken = this.jwtHelper.generateAccessToken(
                {
                    userId: jwtPayload.userId,
                },
                '1d',
            );

            const { password, ...entityWithoutPassword } = user;

            const data = {
                token: accessToken,
                user: entityWithoutPassword,
            };

            return ResponseUtils.successResponseHandler(201, 'Token generated successfully!', 'data', data);
        } catch (e) {
            throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
        }
    }

    async logout(res: Response): Promise<any> {
        try {
            res.clearCookie('refreshtoken', { path: '/api/v1/auth/access-token' });
            return ResponseUtils.successResponseHandler(200, 'Logged out!');
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }
}
