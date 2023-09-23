import { Quantity } from '../quantity';

export class AddProductDto {
  name: string;
  quantity: Quantity;
  price: number;
  constructor(addProductDto: AddProductDto) {
    this.name = addProductDto.name;
    this.quantity = addProductDto.quantity;
    this.price = addProductDto.price;
  }
}
