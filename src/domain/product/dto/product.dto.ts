import { Quantity } from '../../quantity';

interface ProductDtoProps {
  id: string;
  name: string;
  quantity: Quantity;
  price: number;
  isActive: boolean;
}

export class ProductDto implements ProductDtoProps {
  id: string;
  name: string;
  quantity: Quantity;
  price: number;
  isActive: boolean;

  constructor(productDto: ProductDtoProps) {
    this.id = productDto.id;
    this.name = productDto.name;
    this.quantity = productDto.quantity;
    this.price = productDto.price;
    this.isActive = productDto.isActive;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      quantity: this.quantity.value,
      price: this.price,
      isActive: this.isActive,
    };
  }
}
