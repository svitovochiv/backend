import { Injectable } from '@nestjs/common';
import {
  CountAndPrice,
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
    products: OrderedProductWithProductDto[],
    orderStatus: OrderStatus,
  ): OrderedProductWithSumDto[] {
    if (orderStatus === OrderStatus.DELIVERED) {
      return products.map((orderedProduct) => {
        return new OrderedProductWithSumDto({
          ...orderedProduct,
          sum: this.sumProduct({
            price: orderedProduct.price,
            count: orderedProduct.count,
          }),
        });
      });
    } else {
      return products.map((product) => {
        return new OrderedProductWithSumDto({
          ...product,
          sum: this.sumProduct({
            price: product.product.price,
            count: product.count,
          }),
        });
      });
    }
  }

  normalizeCount(count: number) {
    return Math.round(count * 100) / 100;
  }

  getTotalSumProducts(
    orderedProducts: OrderedProductWithProductDto[],
    orderStatus: OrderStatus,
  ) {
    let totalPrice: number;
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
