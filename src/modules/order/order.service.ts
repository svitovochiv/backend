import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { BasketService } from '../basket';
import {
  AddOrderedProducts,
  CreateOrder,
  GetBasketByUserIdDto,
  OrderedProduct,
  OrderMinimalInfoDto,
  OrderStatus,
  PaymentMethod,
  SubmitBasket,
} from '../../domain';
import { CurrencyUtil } from '../../util';

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
    await this.basketService.deleteBasketByUserId({
      userId: submitBasket.userId,
    });
    return createdOrder;
  }

  async getOrdersByUserId({ userId }: { userId: string }) {
    const savedOrders = await this.orderRepository.getOrdersByUserId({
      userId,
    });
    return savedOrders.map((savedOrder) => {
      const totalPrice = savedOrder.OrderedProduct.reduce(
        (acc, orderedProduct) => {
          return acc + orderedProduct.price * orderedProduct.count;
        },
        0,
      );
      const totalPriceRounded = CurrencyUtil.round(totalPrice);
      return new OrderMinimalInfoDto({
        id: savedOrder.id,
        createdAt: savedOrder.createdAt,
        updatedAt: savedOrder.updatedAt,
        totalPrice: totalPriceRounded,
        paymentMethod: savedOrder.ShippingDetails
          .paymentMethod as PaymentMethod,
        status: savedOrder.orderStatus as OrderStatus,
        address: savedOrder.ShippingDetails.address,
        contactNumber: savedOrder.ShippingDetails.number,
        recipient: `${savedOrder.ShippingDetails.firstName} ${savedOrder.ShippingDetails.lastName}`,
      });
    });
  }

  async getAllOrders() {
    const savedOrders = await this.orderRepository.getAllOrders();
    return savedOrders.map((savedOrder) => {
      const totalPrice = savedOrder.OrderedProduct.reduce(
        (acc, orderedProduct) => {
          return acc + orderedProduct.price * orderedProduct.count;
        },
        0,
      );
      const totalPriceRounded = CurrencyUtil.round(totalPrice);
      return new OrderMinimalInfoDto({
        id: savedOrder.id,
        createdAt: savedOrder.createdAt,
        updatedAt: savedOrder.updatedAt,
        totalPrice: totalPriceRounded,
        paymentMethod: savedOrder.ShippingDetails
          .paymentMethod as PaymentMethod,
        status: savedOrder.orderStatus as OrderStatus,
        address: savedOrder.ShippingDetails.address,
        contactNumber: savedOrder.ShippingDetails.number,
        recipient: `${savedOrder.ShippingDetails.firstName} ${savedOrder.ShippingDetails.lastName}`,
      });
    });
  }
}
