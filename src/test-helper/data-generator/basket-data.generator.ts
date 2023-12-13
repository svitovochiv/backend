import { Basket, BasketProduct } from '@prisma/client';
import { faker } from '@faker-js/faker';

export class BasketDataGenerator {
  static basket(data: Partial<Basket>): Basket {
    return {
      userId: faker.string.uuid(),
      id: faker.string.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      ...data,
    };
  }

  static basketProduct(data: Partial<BasketProduct>): BasketProduct {
    return {
      basketId: faker.string.uuid(),
      productId: faker.string.uuid(),
      count: faker.number.float(),
      ...data,
    };
  }
}
