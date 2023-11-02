import { Injectable } from '@nestjs/common';
import { SumProductInfoDto } from '../../domain';
import { CurrencyUtil } from '../../util';

@Injectable()
export class SumAggregatorService {
  sumProducts(products: SumProductInfoDto[]) {
    const sum = products.reduce((acc, orderedProduct) => {
      return acc + orderedProduct.price * orderedProduct.count;
    }, 0);
    return CurrencyUtil.round(sum);
  }
}
