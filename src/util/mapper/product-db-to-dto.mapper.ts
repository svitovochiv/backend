import { Product } from '@prisma/client';
import { ProductDto, Quantity } from '../../domain';

export class ProductDbToDtoMapper {
  static productDbToDto(product: Product): ProductDto {
    return new ProductDto({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity as Quantity,
      isActive: product.isActive,
    });
  }
}
