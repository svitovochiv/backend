export class BasketProductDto {
  basketId: string;
  productId: string;
  count: number;
  cost: number;
  constructor(data: BasketProductDto) {
    this.basketId = data.basketId;
    this.productId = data.productId;
    this.count = data.count;
    this.cost = data.cost;
  }
}
