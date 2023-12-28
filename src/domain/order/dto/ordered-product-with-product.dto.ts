import { ProductDto } from '../../product';
import { OrderedProductDto } from './ordered-product.dto';

export class OrderedProductWithProductDto extends OrderedProductDto {
  product: ProductDto;
  constructor(data: OrderedProductWithProductDto) {
    super(data);
    this.product = data.product;
  }
}
