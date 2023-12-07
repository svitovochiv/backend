import { GetOrderResDb } from '../../modules';
import {
  OrderedProductWithProductDto,
  ProductDto,
  Quantity,
} from '../../domain';

export class OrderDbToDtoMapper {
  static ItemGetOrderToOrderedProductsWithProduct(
    savedOrder: GetOrderResDb,
  ): OrderedProductWithProductDto[] {
    return savedOrder.OrderedProduct.map((orderedProduct) => {
      return new OrderedProductWithProductDto({
        price: orderedProduct.price,
        count: orderedProduct.count,
        name: orderedProduct.product.name,
        productId: orderedProduct.productId,
        orderId: orderedProduct.orderId,
        quantity: orderedProduct.product.quantity as Quantity,
        product: new ProductDto({
          id: orderedProduct.product.id,
          name: orderedProduct.product.name,
          price: orderedProduct.product.price,
          quantity: orderedProduct.product.quantity as Quantity,
          isActive: orderedProduct.product.isActive,
        }),
      });
    });
  }
}
