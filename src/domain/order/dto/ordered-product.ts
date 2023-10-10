export class OrderedProduct {
  count: number;
  price: number;
  productId: string;
  orderId?: string;
  constructor(data: OrderedProduct) {
    this.count = data.count;
    this.price = data.price;
    this.productId = data.productId;
    this.orderId = data.orderId;
  }
}
