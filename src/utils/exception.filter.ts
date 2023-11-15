import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
export interface IFormatExceptionMessage {
	message: string;
	code_error?: number;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
	private logger: Logger;

	catch(exception: any, host: ArgumentsHost) {
			this.logger = new Logger("AllExceptionFilter");
			this.allError(exception, host);
	}

	private allError(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		const message =
			exception instanceof HttpException
				? (exception.getResponse() as IFormatExceptionMessage)
				: { message: (exception as Error).message, code_error: null };

		const responseData = {
			...{
				statusCode: status,
				timestamp: new Date().toISOString(),
				path: request.routerPath,
			},
			...message,
		};

		this.logMessage(request, message, status, exception);

		response.status(status).send(responseData);
	}

	private logMessage(request: any, message: IFormatExceptionMessage, status: number, exception: any) {
		if (status === 500) {
			this.logger.error(
				`method=${request.method} status=${status} code_error=${
					message.code_error ? message.code_error : null
				} message=${message.message ? message.message : null}`,
				status >= 500 ? exception.stack : "",
				`End Request for ${request.routerPath}`,
			);
		} else {
			this.logger.warn(
				`method=${request.method} status=${status} code_error=${
					message.code_error ? message.code_error : null
				} message=${message.message ? message.message : null}`,
				`End Request for ${request.routerPath}`,
			);
		}
	}
}