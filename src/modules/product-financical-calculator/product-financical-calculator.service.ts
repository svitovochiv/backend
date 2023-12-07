import { Injectable } from '@nestjs/common';
import {
  CountAndPrice,
  OrderedProductDto,
  OrderedProductWithProductDto,
  OrderedProductWithSumDto,
  OrderStatus,
} from '../../domain';
import { CurrencyUtil } from '../../util';

@Injectable()
export class ProductFinancialCalculatorService {
  totalSumProducts(products: CountAndPrice[]) {
    const sum = products.reduce((acc, orderedProduct) => {
      return acc + orderedProduct.price * orderedProduct.count;
    }, 0);
    return CurrencyUtil.round(sum);
  }

  sumProduct(product: CountAndPrice) {
    return CurrencyUtil.round(product.price * product.count);
  }

  sumOrderedProducts(
    products: OrderedProductDto[],
  ): OrderedProductWithSumDto[] {
    return products.map((product) => {
      return new OrderedProductWithSumDto({
        ...product,
        sum: this.sumProduct(product),
      });
    });
  }

  normalizeCount(count: number) {
    return Math.round(count * 100) / 100;
  }

  getTotalSumProducts(
    orderedProducts: OrderedProductWithProductDto[],
    orderStatus: OrderStatus,
  ) {
    let totalPrice = 0;
    if (orderStatus === OrderStatus.DELIVERED) {
      totalPrice = this.totalSumProducts(orderedProducts);
    } else {
      const productsPriceAndCount = orderedProducts.map((orderedProduct) => {
        return {
          price: orderedProduct.product.price,
          count: orderedProduct.count,
        };
      });
      totalPrice = this.totalSumProducts(productsPriceAndCount);
    }
    return totalPrice;
  }
}
