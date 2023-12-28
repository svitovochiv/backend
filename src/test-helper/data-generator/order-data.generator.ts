import { Order, OrderedProduct, ShippingDetails } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { GetOrderResDb, OrderedProductWithProductDb } from '../../modules';
import { OrderStatus, PaymentMethod } from '../../domain';
import { ProductDataGenerator } from './product-data.generator';

export class OrderDataGenerator {
  static shippingDetails(): ShippingDetails {
    return {
      id: faker.string.uuid(),
      address: faker.location.streetAddress(),
      userId: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      number: faker.phone.number(),
      paymentMethod: faker.helpers.enumValue(PaymentMethod),
      createdAt: faker.date.between({
        from: '2021-01-01',
        to: new Date(),
      }),
      updatedAt: faker.date.between({
        from: '2021-01-01',
        to: new Date(),
      }),
    };
  }

  static orderedProduct(): OrderedProduct {
    return {
      id: faker.string.uuid(),
      orderId: faker.string.uuid(),
      productId: faker.string.uuid(),
      count: faker.number.int({ min: 1, max: 10 }),
      price: Number(faker.commerce.price({ dec: 2, max: 400 })),
    };
  }

  static orderedProducts(params?: { count?: number }): OrderedProduct[] {
    const count = params?.count || faker.number.int({ min: 0, max: 10 });
    return Array.from({ length: count }).map(() => this.orderedProduct());
  }

  static orderedProductWithProduct(): OrderedProductWithProductDb {
    return {
      ...this.orderedProduct(),
      product: ProductDataGenerator.product(),
    };
  }

  static orderedProductsWithProduct(params?: {
    count?: number;
  }): OrderedProductWithProductDb[] {
    const count = params?.count || faker.number.int({ min: 0, max: 10 });
    return Array.from({ length: count }).map(() =>
      this.orderedProductWithProduct(),
    );
  }

  static changeOrderStatus<T extends Order>({
    orderStatus,
    order,
  }: {
    order: T;
    orderStatus: OrderStatus;
  }): T {
    return {
      ...order,
      orderStatus,
    };
  }
  static orderWithShippingDetailsAndOrderedProducts(params?: {
    orderStatus?: OrderStatus;
  }): GetOrderResDb {
    const order = this.order({
      orderStatus: params?.orderStatus,
    });
    return {
      ...order,
      ShippingDetails: this.shippingDetails(),
      OrderedProduct: this.orderedProductsWithProduct(),
    };
  }

  static order(params?: Partial<Order>): Order {
    return {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      shippingDetailsId: faker.string.uuid(),
      orderStatus: faker.helpers.enumValue(OrderStatus),
      createdAt: faker.date.between({
        from: '2021-01-01',
        to: new Date(),
      }),
      updatedAt: faker.date.between({
        from: '2021-01-01',
        to: new Date(),
      }),
      ...params,
    };
  }
}
