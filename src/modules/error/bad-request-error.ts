import { IError } from './interface';
import { CustomError } from './custom.error';

export class BadRequestError extends CustomError {
  constructor(message: string, public statusCode: number = 400) {
    super(message, statusCode);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): IError {
    return {
      errorMessages: [{ message: this.message }],
      statusCode: this.getStatus(),
    };
  }
}
