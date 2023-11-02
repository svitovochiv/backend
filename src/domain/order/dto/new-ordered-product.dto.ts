import { CountAndPriceDto } from '../../sum-aggregator';

export class NewOrderedProductDto extends CountAndPriceDto {
  name: string;
  productId: string;
  constructor(data: NewOrderedProductDto) {
    super(data);
    this.productId = data.productId;
    this.name = data.name;
  }
}
