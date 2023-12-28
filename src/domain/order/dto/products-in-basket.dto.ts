import { Quantity } from '../../quantity';

export class ProductsInBasketDto {
  productId: string;
  count: number;
  quantity: Quantity;
  price: number;
  name: string;
  sum: number;
  isActive: boolean;

  constructor(data: ProductsInBasketDto) {
    this.productId = data.productId;
    this.count = data.count;
    this.quantity = data.quantity;
    this.price = data.price;
    this.name = data.name;
    this.sum = data.sum;
    this.isActive = data.isActive;
  }
}
