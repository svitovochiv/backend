import { CountAndPriceDto } from '../../sum-aggregator';
import { Quantity } from '../../product';

export class OrderedProduct extends CountAndPriceDto {
  name: string;
  productId: string;
  orderId: string;
  quantity: Quantity;
  constructor(data: OrderedProduct) {
    super(data);
    this.productId = data.productId;
    this.name = data.name;
    this.orderId = data.orderId;
    this.quantity = data.quantity;
  }
}
