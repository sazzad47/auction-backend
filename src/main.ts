import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { Constants } from './utils/constants';
import { AllExceptionFilter } from './utils/exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new AllExceptionFilter());

    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        exposedHeaders: ["set-cookie"]
    });

    app.use(bodyParser.json({ limit: '100mb' }));
    app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

    app.use(cookieParser());

    app.setGlobalPrefix(Constants.API);

    app.enableVersioning({
        type: VersioningType.URI
    });

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(process.env.PORT || 5000);


}

bootstrap();
