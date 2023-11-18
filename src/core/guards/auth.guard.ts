import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import JwtHelper from '../jwt/jwt.helper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from '../../modules/users/schema/users.schema';
import { UsersRepository } from '../../modules/users/users.repository';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtHelper: JwtHelper,
        @InjectModel('Users') private readonly usersModel: Model<Users>,
    ) {}

    private readonly usersRepository = new UsersRepository(this.usersModel);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        return await this.validateRequest(req);
    }

    async validateRequest(req: any): Promise<boolean> {
        try {
            const bearerToken = req.headers.authorization;
            const bearer = 'Bearer ';
            if (!bearerToken || !bearerToken.startsWith(bearer)) {
                return false;
            }
            const token = bearerToken.replace(bearer, '');
            const jwtPayload = await this.jwtHelper.verifyAccessToken(token);
            const data = await this.usersRepository.findOneEntity(jwtPayload.userId);
            if (!data || data instanceof Error) {
                return false;
            }

            req.user = data;

            return true;
        } catch (e) {
            return false;
        }
    }
}
