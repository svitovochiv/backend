import { Quantity } from '../quantity';

export class ParsedProductDto {
  position: number;
  name: string;
  quantity: Quantity;
  price: number;
  constructor(parsedProductDto: ParsedProductDto) {
    this.name = parsedProductDto.name;
    this.quantity = parsedProductDto.quantity;
    this.price = parsedProductDto.price;
    this.position = parsedProductDto.position;
  }
}
