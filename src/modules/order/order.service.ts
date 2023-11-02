import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { BasketService } from '../basket';
import {
  AddOrderedProducts,
  CreateOrder,
  FullOrderInfoDto,
  GetBasketByUserIdDto,
  GetOrderDto,
  NewOrderedProductDto,
  OrderedProduct,
  OrderMinimalInfoDto,
  OrderStatus,
  PaymentMethod,
  Quantity,
  SubmitBasket,
} from '../../domain';
import { CurrencyUtil } from '../../util';
import { BadRequestError } from '../../exceptions';
import { SumAggregatorService } from '../sum-aggregator';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly basketService: BasketService,
    private readonly sumAggregatorService: SumAggregatorService,
  ) {}

  async submitOrder(submitBasket: SubmitBasket) {
    const createdShippingDetails =
      await this.orderRepository.createShippingDetails(
        submitBasket.shippingDetails,
      );

    const createOrder: CreateOrder = new CreateOrder({
      userId: submitBasket.userId,
      shippingDetailsId: createdShippingDetails.id,
    });
    const orderedProducts: NewOrderedProductDto[] = (
      await this.basketService.getProductsInBasket(
        new GetBasketByUserIdDto({
          userId: submitBasket.userId,
        }),
      )
    ).map((product) => {
      return new NewOrderedProductDto({
        productId: product.productId,
        count: product.count,
        price: product.price,
        name: product.name,
      });
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

  async getOrderById(getOrderDto: GetOrderDto) {
    const savedOrder = await this.orderRepository.getOrderById(getOrderDto);
    if (!savedOrder) {
      throw new BadRequestError(
        `замовлення з id: ${getOrderDto.id} не знайдено`,
      );
    }

    const orderedProducts: OrderedProduct[] = savedOrder.OrderedProduct.map(
      (orderedProduct) => {
        return new OrderedProduct({
          count: orderedProduct.count,
          price: orderedProduct.price,
          productId: orderedProduct.productId,
          name: orderedProduct.product.name,
          orderId: orderedProduct.orderId,
          quantity: orderedProduct.product.quantity as Quantity,
        });
      },
    );

    const totalPrice =
      this.sumAggregatorService.totalSumProducts(orderedProducts);

    const orderedProductsWithSum =
      this.sumAggregatorService.sumOrderedProducts(orderedProducts);

    return new FullOrderInfoDto({
      id: savedOrder.id,
      createdAt: savedOrder.createdAt,
      updatedAt: savedOrder.updatedAt,
      totalPrice: totalPrice,
      paymentMethod: savedOrder.ShippingDetails.paymentMethod as PaymentMethod,
      status: savedOrder.orderStatus as OrderStatus,
      address: savedOrder.ShippingDetails.address,
      contactNumber: savedOrder.ShippingDetails.number,
      recipient: `${savedOrder.ShippingDetails.firstName} ${savedOrder.ShippingDetails.lastName}`,
      orderedProducts: orderedProductsWithSum,
    });
  }
}
