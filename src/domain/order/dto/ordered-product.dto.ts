import { CountAndPrice } from '../../sum-aggregator';
import { Quantity } from '../../product';

export class OrderedProductDto implements CountAndPrice {
  name: string;
  productId: string;
  orderId: string;
  quantity: Quantity;
  count: number;
  price: number;

  constructor(data: OrderedProductDto) {
    this.productId = data.productId;
    this.name = data.name;
    this.orderId = data.orderId;
    this.quantity = data.quantity;
    this.count = data.count;
    this.price = data.price;
  }
}