import { NewOrderedProductDto } from '../dto';

export class AddOrderedProducts {
  orderId: string;
  orderedProducts: NewOrderedProductDto[];
  constructor(data: AddOrderedProducts) {
    this.orderId = data.orderId;
    this.orderedProducts = data.orderedProducts;
  }
}
