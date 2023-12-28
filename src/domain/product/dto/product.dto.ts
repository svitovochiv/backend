import { Quantity } from '../../quantity';
export class ProductDto {
  id: string;
  name: string;
  quantity: Quantity;
  price: number;
  isActive: boolean;

  constructor(productDto: ProductDto) {
    this.id = productDto.id;
    this.name = productDto.name;
    this.quantity = productDto.quantity;
    this.price = productDto.price;
    this.isActive = productDto.isActive;
  }
}
