import { HttpException } from '@nestjs/common';
import { IError } from './interface';

export abstract class CustomError extends HttpException {
  constructor(protected errorMessage: string, status: number) {
    super(errorMessage, status);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): IError;
}
