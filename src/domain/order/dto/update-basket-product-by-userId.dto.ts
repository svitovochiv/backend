export class UpdateBasketProductByUserIdDto {
  userId: string;
  productId: string;
  count?: number;
  constructor(updateBasketProductDto: UpdateBasketProductByUserIdDto) {
    this.userId = updateBasketProductDto.userId;
    this.productId = updateBasketProductDto.productId;
    this.count = updateBasketProductDto.count;
  }
}
