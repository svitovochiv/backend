import { OrderedProduct } from './ordered-product';

export class OrderedProductWithSumDto extends OrderedProduct {
  sum: number;
  constructor(data: OrderedProductWithSumDto) {
    super(data);
    this.sum = data.sum;
  }
}
