import { Quantity } from '../quantity';

export class ProductDto {
  name: string;
  quantity: Quantity;
  price: number;
  isActive: boolean;
  constructor(productDto: ProductDto) {
    this.name = productDto.name;
    this.quantity = productDto.quantity;
    this.price = productDto.price;
    this.isActive = productDto.isActive;
  }
}
