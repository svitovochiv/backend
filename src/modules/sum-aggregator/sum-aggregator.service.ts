import { Injectable } from '@nestjs/common';
import {
  CountAndPriceDto,
  OrderedProduct,
  OrderedProductWithSumDto,
} from '../../domain';
import { CurrencyUtil } from '../../util';

@Injectable()
export class SumAggregatorService {
  totalSumProducts(products: CountAndPriceDto[]) {
    const sum = products.reduce((acc, orderedProduct) => {
      return acc + orderedProduct.price * orderedProduct.count;
    }, 0);
    return CurrencyUtil.round(sum);
  }

  sumProduct(product: CountAndPriceDto) {
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
}
