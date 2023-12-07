import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import {
  AddOrderedProducts,
  CreateOrder,
  GetOrderDto,
  ShippingDetails,
} from '../../domain';

import { Prisma } from '@prisma/client';
import { GetOrderResDb } from './interface';

@Injectable()
export class OrderRepository {
  constructor(private readonly db: PrismaService) {}

  createOrder(submitBasket: CreateOrder) {
    return this.order.create({
      data: {
        userId: submitBasket.userId,
        shippingDetailsId: submitBasket.shippingDetailsId,
        orderStatus: submitBasket.orderStatus,
      },
    });
  }

  createShippingDetails(submitBasket: ShippingDetails) {
    return this.shippingDetails.create({
      data: {
        address: submitBasket.address,
        number: submitBasket.number,
        firstName: submitBasket.firstName,
        lastName: submitBasket.lastName,
        paymentMethod: submitBasket.paymentMethod,
        userId: submitBasket.userId,
      },
    });
  }

  addOrderedProducts(addOrderedProducts: AddOrderedProducts) {
    const formattedOrderedProducts: Prisma.OrderedProductCreateManyInput[] =
      addOrderedProducts.orderedProducts.map((orderedProduct) => {
        return {
          orderId: addOrderedProducts.orderId,
          productId: orderedProduct.productId,
          count: orderedProduct.count,
          price: orderedProduct.price,
        };
      });
    return this.orderedProduct.createMany({
      data: formattedOrderedProducts,
    });
  }

  // getOrdersByUserId({ userId }: { userId: string }) {
  //   return this.order.findMany({
  //     where: {
  //       userId,
  //     },
  //     orderBy: {
  //       updatedAt: 'desc',
  //     },
  //     include: {
  //       ShippingDetails: true,
  //       OrderedProduct: {
  //         include: {
  //           product: true,
  //         },
  //       },
  //     },
  //   });
  // }

  getOrders(query?: { userId?: string }): Promise<GetOrderResDb[]> {
    return this.order.findMany({
      where: {
        userId: query?.userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        ShippingDetails: true,
        OrderedProduct: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  getOrderById({ id }: GetOrderDto) {
    return this.order.findUnique({
      where: {
        id: id,
      },
      include: {
        ShippingDetails: true,
        OrderedProduct: {
          include: {
            product: true,
          },
          orderBy: {
            id: 'asc',
          },
        },
        user: true,
      },
    });
  }

  private get order() {
    return this.db.order;
  }

  private get orderedProduct() {
    return this.db.orderedProduct;
  }

  private get shippingDetails() {
    return this.db.shippingDetails;
  }
}
