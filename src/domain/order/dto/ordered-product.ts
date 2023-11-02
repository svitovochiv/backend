import { CountAndPriceDto } from '../../sum-aggregator';

export class OrderedProduct extends CountAndPriceDto {
  name: string;
  productId: string;
  orderId: string;
  constructor(data: OrderedProduct) {
    super(data);
    this.productId = data.productId;
    this.name = data.name;
    this.orderId = data.orderId;
  }
}
