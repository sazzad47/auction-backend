import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Constants } from '../utils/constants';

@Injectable()
export class CookiePathMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const cookiePathPrefix = `${Constants.API}/${Constants.API_VERSION_1}`;

        if (!req.path.startsWith(cookiePathPrefix)) {
            const updatedPath = `${cookiePathPrefix}${req.path}`;
            req.url = updatedPath;
        }

        next();
    }
}
