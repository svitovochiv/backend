import { Injectable } from '@nestjs/common';
import {
  CountAndPrice,
  OrderedProduct,
  OrderedProductWithSumDto,
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

  sumOrderedProducts(products: OrderedProduct[]): OrderedProductWithSumDto[] {
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
}
