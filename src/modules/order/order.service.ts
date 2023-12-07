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
  OrderedProductDto,
  OrderedProductWithProductDto,
  OrderMinimalInfoDto,
  OrderStatus,
  PaymentMethod,
  ProductDto,
  Quantity,
  SubmitBasket,
} from '../../domain';
import { BadRequestError } from '../../exceptions';
import { ProductFinancialCalculatorService } from '../product-financical-calculator';
import { OrderDbToDtoMapper } from '../../util/mapper';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly basketService: BasketService,
    private readonly sumAggregatorService: ProductFinancialCalculatorService,
  ) {}

  async submitBasket(submitBasket: SubmitBasket) {
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

  async getAllOrders(query?: { userId?: string }) {
    const savedOrders = await this.orderRepository.getOrders(query);
    return savedOrders.map((savedOrder) => {
      const orderStatus = this.checkOrderStatusType(savedOrder.orderStatus);

      const mappedOrderedProducts =
        OrderDbToDtoMapper.ItemGetOrderToOrderedProductsWithProduct(savedOrder);
      const totalPrice = this.sumAggregatorService.getTotalSumProducts(
        mappedOrderedProducts,
        orderStatus,
      );

      return new OrderMinimalInfoDto({
        id: savedOrder.id,
        createdAt: savedOrder.createdAt,
        updatedAt: savedOrder.updatedAt,
        totalPrice: totalPrice,
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

    const orderedProducts: OrderedProductDto[] = savedOrder.OrderedProduct.map(
      (orderedProduct) => {
        return new OrderedProductDto({
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

  checkOrderStatusType(orderStatus: string) {
    const orderStatuses = Object.values(OrderStatus);
    if (!orderStatuses.includes(orderStatus as OrderStatus)) {
      throw new BadRequestError(
        `Статус замовлення ${orderStatus} не підтримується`,
      );
    }
    return orderStatus as OrderStatus;
  }
}
