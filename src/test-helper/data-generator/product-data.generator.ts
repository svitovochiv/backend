import { Product } from '@prisma/client';
import { Quantities } from '../../domain';
import { faker } from '@faker-js/faker';
export class ProductDataGenerator {
  static product(): Omit<Product, 'quantity'> & { quantity: Quantities } {
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price({ dec: 2, max: 300 })),
      quantity: faker.helpers.enumValue(Quantities),
      isActive: faker.datatype.boolean(),
      createdAt: faker.date.between({
        from: '2021-01-01',
        to: new Date(),
      }),
      updatedAt: new Date(),
    };
  }

  static products(params?: { count?: number }): Product[] {
    const count = params?.count || faker.number.int({ min: 0, max: 10 });
    return Array.from({ length: count }).map(() => this.product());
  }
}
