import { Injectable } from '@nestjs/common';
import {
  CountAndPrice,
  OrderedProductWithProductDto,
  OrderedProductWithSumDto,
  OrderStatus,
} from '../../domain';

@Injectable()
export class ProductFinancialCalculatorService {
  calculateProductsCost(products: CountAndPrice[]) {
    return products.reduce((acc, orderedProduct) => {
      return acc + this.calculateProductCost(orderedProduct);
    }, 0);
  }

  sumOrderedProducts(
    products: OrderedProductWithProductDto[],
    orderStatus: OrderStatus,
  ): OrderedProductWithSumDto[] {
    return products.map((product) => {
      const countAndPrice = this.gerOrderedProductPrice(product, orderStatus);
      return this.createOrderedProductWithSum(countAndPrice, product);
    });
  }

  createOrderedProductWithSum(
    countAndPrice: CountAndPrice,
    product: OrderedProductWithProductDto,
  ): OrderedProductWithSumDto {
    return new OrderedProductWithSumDto({
      ...product,
      sum: this.calculateProductCost(countAndPrice),
    });
  }

  gerOrderedProductPrice(
    product: OrderedProductWithProductDto,
    orderStatus: OrderStatus,
  ): CountAndPrice {
    return this.isOrderDelivered(orderStatus)
      ? { price: product.price, count: product.count }
      : { price: product.product.price, count: product.count };
  }

  getSumOrderedProducts(
    orderedProducts: OrderedProductWithProductDto[],
    orderStatus: OrderStatus,
  ) {
    const productsPriceAndCount = orderedProducts.map((orderedProduct) => {
      return this.gerOrderedProductPrice(orderedProduct, orderStatus);
    });
    return this.calculateProductsCost(productsPriceAndCount);
  }

  calculateProductCost(product: CountAndPrice): number {
    return this.normalizeSum(product.price * product.count);
  }
  normalizeSum(count: number) {
    return Math.round(count * 100) / 100;
  }

  normalizeCount(count: number) {
    return Math.round(count * 100) / 100;
  }
  private isOrderDelivered(orderStatus: OrderStatus): boolean {
    return orderStatus === OrderStatus.DELIVERED;
  }
}
