import { Product } from '@prisma/client';
import { ProductDto, Quantity } from '../../domain';

export class ProductDbToDtoMapper {
  static productDbToDto(product: Product): ProductDto {
    return new ProductDto({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: new Quantity(product.quantity),
      isActive: product.isActive,
    });
  }
}
