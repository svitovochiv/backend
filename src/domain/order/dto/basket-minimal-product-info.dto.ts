export class BasketMinimalProductInfoDto {
  basketId: string;
  productId: string;
  count: number;
  constructor(data: BasketMinimalProductInfoDto) {
    this.basketId = data.basketId;
    this.productId = data.productId;
    this.count = data.count;
  }
}
