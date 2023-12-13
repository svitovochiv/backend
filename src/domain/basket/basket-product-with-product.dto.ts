import { ProductDto } from '../product';
import { BasketProductDto } from './basket-product.dto';

export class BasketProductWithProductDto extends BasketProductDto {
  product: ProductDto;
  constructor(data: BasketProductWithProductDto) {
    super(data);
    this.product = data.product;
  }
}
