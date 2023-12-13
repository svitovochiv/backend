import { CountAndPrice } from '../../domain';
import { faker } from '@faker-js/faker';

export class ProductFinancialGenerator {
  static priceAndCount(): CountAndPrice {
    return {
      price: Number(faker.commerce.price({ dec: 2, max: 300 })),
      count: faker.number.float({ min: 1, max: 10, precision: 0.01 }),
    };
  }
  static priceAndCountList(params?: { count?: number }): CountAndPrice[] {
    const count = params?.count || faker.number.int({ min: 0, max: 10 });
    return Array.from({ length: count }).map(() => this.priceAndCount());
  }
}
