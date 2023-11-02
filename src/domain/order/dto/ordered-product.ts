import { SumProductInfoDto } from '../../sum-aggregator';

export class OrderedProduct extends SumProductInfoDto {
  productId: string;
  orderId?: string;
  constructor(data: OrderedProduct) {
    super(data);
    this.productId = data.productId;
    this.orderId = data.orderId;
  }
}
