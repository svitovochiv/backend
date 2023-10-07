export class BasketProductDto {
  basketId: string;
  productId: string;
  count: number;
  constructor(data: BasketProductDto) {
    this.basketId = data.basketId;
    this.productId = data.productId;
    this.count = data.count;
  }
}
