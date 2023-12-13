import { OrderedProductDto } from './ordered-product.dto';

export class OrderedProductWithSumDto extends OrderedProductDto {
  sum: number;
  constructor(data: OrderedProductWithSumDto) {
    super(data);
    this.sum = data.sum;
  }
}
