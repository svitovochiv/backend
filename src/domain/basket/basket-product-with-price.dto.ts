import { CountAndPrice } from '../sum-aggregator';
import { BasketProductDto } from './basket-product.dto';

export class BasketProductWithPriceDto
  extends BasketProductDto
  implements CountAndPrice
{
  price: number;
  constructor(data: BasketProductWithPriceDto) {
    super(data);
    this.price = data.price;
  }
}
