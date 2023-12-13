export class BasketProductDto {
  productId: string;
  count: number;
  basketId: string;

  constructor(data: BasketProductDto) {
    this.count = data.count;
    this.productId = data.productId;
    this.basketId = data.basketId;
  }
}
