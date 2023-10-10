import { OrderedProduct } from '../dto';

export class AddOrderedProducts {
  orderId: string;
  orderedProducts: OrderedProduct[];
  constructor(data: AddOrderedProducts) {
    this.orderId = data.orderId;
    this.orderedProducts = data.orderedProducts;
  }
}
