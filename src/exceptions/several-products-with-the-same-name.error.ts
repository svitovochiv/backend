import { ParsedProductDto } from '../domain';
import { CustomError } from './custom.error';
import { IError } from './interface';

export class SeveralProductsWithTheSameNameError extends CustomError {
  constructor(
    infoProduct1: ParsedProductDto[],
    public statusCode: number = 400,
  ) {
    const structuredProductInfo = infoProduct1
      .map(({ name, position }) => `назва: ${name}, позиція: ${position}`)
      .join('; ');
    const message = `Декілька продуктів з однаковою назвою у файлі: ${structuredProductInfo}`;
    super(message, statusCode);

    Object.setPrototypeOf(this, SeveralProductsWithTheSameNameError.prototype);
  }

  serializeErrors(): IError {
    return {
      errorMessages: [{ message: this.message }],
      statusCode: this.getStatus(),
    };
  }
}
