export class DeleteProductInBasketDto {
  userId: string;
  productId: string;
  constructor(data: DeleteProductInBasketDto) {
    this.userId = data.userId;
    this.productId = data.productId;
  }
}
