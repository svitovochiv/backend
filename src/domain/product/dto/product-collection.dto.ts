import { ProductDto } from './product.dto';

export class ProductCollectionDto {
  products: ProductDto[];
  take?: number;
  skip?: number;
  total: number;

  constructor(productCollectionDto: ProductCollectionDto) {
    this.products = productCollectionDto.products;
    this.take = productCollectionDto.take;
    this.skip = productCollectionDto.skip;
    this.total = productCollectionDto.total;
  }
}
