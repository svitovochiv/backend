import { Basket, BasketProduct } from '@prisma/client';
import { da, faker } from '@faker-js/faker';
import { GetBasketProductsDb } from '../../modules/basket/interface';
import { ProductDataGenerator } from './product-data.generator';
import { Quantities, quantityPrecisionMap } from '../../domain';
import { UserDataGenerator } from './user-data.generator';

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

  static basketProductWithProduct(
    data?: Partial<GetBasketProductsDb>,
  ): GetBasketProductsDb {
    const product = ProductDataGenerator.product();
    return {
      basketId: faker.string.uuid(),
      productId: product.id,
      count: this.generateProductCount(product.quantity),
      product,
      ...data,
    };
  }

  static generateProductCount(quantity: Quantities) {
    return faker.number.float({
      min: 1,
      max: 10,
      precision: quantityPrecisionMap[quantity],
    });
  }

  static basketProductsWithProduct(data?: {
    basketId?: string;
    count?: number;
  }) {
    const count = data?.count ?? faker.number.int({ min: 1, max: 10 });

    const basketId = data?.basketId ?? faker.string.uuid();

    return Array.from({ length: count }).map(() =>
      BasketDataGenerator.basketProductWithProduct({
        basketId,
      }),
    );
  }

  static basketOfUser() {
    const client = UserDataGenerator.customer();
    const basket = this.basket({ userId: client.id });
    const basketProductsWithProduct = this.basketProductsWithProduct({
      basketId: basket.id,
      count: 4,
    });

    return {
      client,
      basket,
      basketProductsWithProduct,
    };
  }
}
