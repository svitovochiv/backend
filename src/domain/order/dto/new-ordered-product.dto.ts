import { CountAndPrice } from '../../sum-aggregator';

export class NewOrderedProductDto implements CountAndPrice {
  name: string;
  productId: string;
  count: number;
  price: number;
  constructor(data: NewOrderedProductDto) {
    this.productId = data.productId;
    this.name = data.name;
    this.count = data.count;
    this.price = data.price;
  }
}
