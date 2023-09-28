import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { IError } from './interface';
import { CustomError } from './custom.error';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    if (exception instanceof CustomError) {
      response.status(status).json(exception.serializeErrors());
    } else {
      const errors: IError = {
        errorMessages: [
          { message: JSON.stringify(exception.getResponse(), null, 3) },
        ],
        statusCode: status,
      };
      response.status(status).json(errors);
    }
  }
}
