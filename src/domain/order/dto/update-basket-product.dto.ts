export class UpdateBasketProductDto {
  basketId: string;
  productId: string;
  count: number;

  constructor(updateBasketProductDto: UpdateBasketProductDto) {
    this.productId = updateBasketProductDto.productId;
    this.count = updateBasketProductDto.count;
    this.basketId = updateBasketProductDto.basketId;
  }
}
