import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { BasketService } from '../basket';
import {
  AddOrderedProducts,
  CreateOrder,
  GetBasketByUserIdDto,
  OrderedProduct,
  SubmitBasket,
} from '../../domain';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly basketService: BasketService,
  ) {}

  async submitOrder(submitBasket: SubmitBasket) {
    const orderedProducts: OrderedProduct[] = (
      await this.basketService.getProductsInBasket(
        new GetBasketByUserIdDto({
          userId: submitBasket.userId,
        }),
      )
    ).map((product) => {
      return new OrderedProduct({
        productId: product.productId,
        count: product.count,
        price: product.price,
      });
    });

    const createdShippingDetails =
      await this.orderRepository.createShippingDetails(
        submitBasket.shippingDetails,
      );

    const createOrder: CreateOrder = new CreateOrder({
      userId: submitBasket.userId,
      shippingDetailsId: createdShippingDetails.id,
    });
    const createdOrder = await this.orderRepository.createOrder(createOrder);
    await this.orderRepository.addOrderedProducts(
      new AddOrderedProducts({
        orderId: createdOrder.id,
        orderedProducts: orderedProducts,
      }),
    );
    return createdOrder;
  }
}
